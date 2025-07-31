'use client';
import { paymentAccounts, sampleCourse } from "../constants";


export default function DescriptionPage() {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB'
        }).format(price);
    };

    // const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

    // const onSubmit = async (data: paymeentFormType) => {
    //     try {
    //         console.log("Payment data:", data);
    //         if (dialogCloseRef.current) {
    //             dialogCloseRef.current.click();
    //         }
    //     } catch (error) {

    //         console.error("Submission failed:", error);

    //     }
    // };


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{sampleCourse.title}</h1>
                        <p className="text-blue-100 text-lg">{sampleCourse.description}</p>
                    </div>

                    <div className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{sampleCourse.duration}</div>
                                <div className="text-gray-600">Duration</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{sampleCourse.level}</div>
                                <div className="text-gray-600">Level</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{formatPrice(sampleCourse.price)}</div>
                                <div className="text-gray-600">Price</div>
                            </div>
                        </div>
                        <div className="accounts">
                            <p>Success Academy</p>
                            {paymentAccounts.map(account => <p key={account.id} className="text-gray-600">{account.bankName}: {account.accountNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Course Features */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What You&apos;ll Get</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sampleCourse.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Curriculum */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
                    <div className="space-y-3">
                        {sampleCourse.curriculum.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <span className="text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Modal */}


            </div>
        </div>
    );
}
