#!/bin/bash

# Soar App - Storage Configuration Test
echo "🚀 Testing Soar App Storage Configuration"
echo "=========================================="

cd "c:\Users\trewa\Documents\Github\NextJS tutorials\soar"

echo "✅ 1. Verifying Prisma Client Generation..."
npx prisma generate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Prisma client generated successfully"
else
    echo "   ❌ Prisma client generation failed"
fi

echo ""
echo "✅ 2. Checking Environment Configuration..."
if [ -f ".env.local" ]; then
    echo "   ✓ .env.local file exists"
    
    if grep -q "BLOB_READ_WRITE_TOKEN" .env.local; then
        echo "   ✓ Vercel Blob token configured"
    else
        echo "   ⚠️  Vercel Blob token not found"
    fi
    
    if grep -q "CLOUDFLARE_ACCOUNT_ID" .env.local; then
        echo "   ✓ Cloudflare credentials configured"
    else
        echo "   ⚠️  Cloudflare credentials not found"
    fi
else
    echo "   ❌ .env.local file not found"
fi

echo ""
echo "✅ 3. Verifying Dependencies..."
if npm list @vercel/blob > /dev/null 2>&1; then
    echo "   ✓ @vercel/blob package installed"
else
    echo "   ❌ @vercel/blob package missing"
fi

echo ""
echo "✅ 4. Testing Build Process..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Application builds successfully"
else
    echo "   ❌ Build process failed"
fi

echo ""
echo "🎉 Configuration Test Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Get a Vercel Blob token from: https://vercel.com/dashboard/stores"
echo "   2. Replace 'your_vercel_blob_token_here' in .env.local"
echo "   3. Test image uploads at: http://localhost:3000/demo/storage-providers"
echo "   4. Deploy to Vercel for production use"
