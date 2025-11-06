import { NextRequest, NextResponse } from 'next/server'
import { withAuthorization } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

// ====================================================================
// POST: Upload image to Supabase Storage (Admin only)
// ====================================================================
const uploadHandler = async (request: Request) => { 
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const type = formData.get('type') as string || 'product'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Generate unique file name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `${type}s/${fileName}`; 

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'Upload failed: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(filePath);

    // Update product in database if productId provided
    if (productId && type === 'product') {
      const { error: updateError } = await supabaseAdmin
        .from('Product')
        .update({
          image: publicUrl,
          updatedAt: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) {
        console.error('Product update error:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key: filePath,
      fileName: fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// ====================================================================
// DELETE: Delete image from Supabase Storage (Admin only)
// ====================================================================
const deleteHandler = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const productId = searchParams.get('productId');

    if (!key) {
      return NextResponse.json(
        { error: 'No key provided' },
        { status: 400 }
      );
    }

    // Delete from Supabase Storage
    const { data: deleteData, error: deleteError } = await supabaseAdmin.storage
      .from('uploads')
      .remove([key]);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return NextResponse.json(
        { error: 'Delete failed: ' + deleteError.message },
        { status: 500 }
      );
    }

    // Update product in database if productId provided
    if (productId) {
      const { error: updateError } = await supabaseAdmin
        .from('Product')
        .update({
          image: null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) {
        console.error('Product update error:', updateError);
        // Don't fail the delete if product update fails
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}

// Export with authorization
export const POST = withAuthorization(uploadHandler, ['ADMIN', 'EDITOR'])
export const DELETE = withAuthorization(deleteHandler, ['ADMIN', 'EDITOR'])
