import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()

    // Get authenticated user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'You must be logged in to upload documents.' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication. Please log in again.' },
        { status: 401 }
      )
    }

    // Parse FormData
    const formData = await request.formData()
    const claimAttemptId = formData.get('claim_attempt_id') as string
    const documentType = formData.get('document_type') as string
    const file = formData.get('file') as File | null

    if (!claimAttemptId || !documentType || !file) {
      return NextResponse.json(
        { error: 'Claim ID, document type, and file are required.' },
        { status: 400 }
      )
    }

    // Validate document type
    const validTypes = ['cac_certificate', 'utility_bill']
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid document type. Must be cac_certificate or utility_bill.' },
        { status: 400 }
      )
    }

    // Verify the claim attempt belongs to this user
    const { data: claim, error: claimError } = await supabase
      .from('claim_attempts')
      .select('id, user_id, status')
      .eq('id', claimAttemptId)
      .single()

    if (claimError || !claim) {
      return NextResponse.json(
        { error: 'Claim attempt not found.' },
        { status: 404 }
      )
    }

    if (claim.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only upload documents for your own claims.' },
        { status: 403 }
      )
    }

    if (claim.status !== 'pending') {
      return NextResponse.json(
        { error: 'Documents can only be uploaded for pending claims.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB.' },
        { status: 400 }
      )
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop() || 'pdf'
    const fileName = `${user.id}/${claimAttemptId}/${documentType}.${fileExt}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('claim-documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload document. Please try again.' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('claim-documents')
      .getPublicUrl(fileName)

    const documentUrl = urlData?.publicUrl || fileName

    // Update claim attempt with document info
    const { error: updateError } = await supabase
      .from('claim_attempts')
      .update({
        document_url: documentUrl,
        document_type: documentType,
      })
      .eq('id', claimAttemptId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Document uploaded but failed to update claim. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully. Your claim is under review.',
      document_url: documentUrl,
    })
  } catch (err) {
    console.error('Claim upload error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
