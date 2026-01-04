'use client';

import React from 'react';
import DocumentUploader from '@/components/upload/DocumentUploader';

export default function UploadDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Document Upload Module</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Strict compliance upload for Government Application Form
                    </p>
                </div>

                {/* 1. Photograph */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">1. Photograph</h2>
                    <DocumentUploader
                        label="Passport Size Photograph"
                        type="photo"
                        required={true}
                        rules={{
                            minSizeKB: 20,
                            maxSizeKB: 50,
                            allowedTypes: ['image/jpeg'],
                            width: 200,
                            height: 230,
                            dimensionTolerance: 10 // Allow slight flexibility
                        }}
                    />
                </div>

                {/* 2. Signature */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">2. Signature</h2>
                    <DocumentUploader
                        label="Candidate Signature"
                        type="signature"
                        required={true}
                        rules={{
                            minSizeKB: 10,
                            maxSizeKB: 20,
                            allowedTypes: ['image/jpeg'],
                            width: 140,
                            height: 60,
                            dimensionTolerance: 5
                        }}
                    />
                </div>

                {/* 3. LTI */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">3. Left Thumb Impression</h2>
                    <DocumentUploader
                        label="Left Thumb Impression"
                        type="thumb"
                        required={true}
                        rules={{
                            minSizeKB: 20,
                            maxSizeKB: 50,
                            allowedTypes: ['image/jpeg'],
                            width: 240,
                            height: 240,
                            dimensionTolerance: 10
                        }}
                    />
                </div>

                {/* 4. Declaration */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">4. Hand-written Declaration</h2>
                    <DocumentUploader
                        label="Declaration"
                        type="declaration"
                        required={true}
                        rules={{
                            minSizeKB: 50,
                            maxSizeKB: 100,
                            allowedTypes: ['image/jpeg'],
                            width: 800,
                            height: 400,
                            dimensionTolerance: 20
                        }}
                    />
                </div>

                <div className="flex justify-end pt-6">
                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-lg transition-transform active:scale-95">
                        Submit Documents
                    </button>
                </div>

            </div>
        </div>
    );
}
