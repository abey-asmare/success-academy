import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Terms of Use</CardTitle>
            <p className="text-gray-600 mt-2">Success Academy - successacademy.et</p>
            <p className="text-sm text-gray-500">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Success Academy (successacademy.et), you accept and agree to be bound by the
                  terms and provision of this agreement. If you do not agree to abide by the above, please do not use
                  this service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Success Academy is an e-learning platform that provides educational content, courses, and learning
                  materials to students in Ethiopia and beyond. Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Online courses and educational content</li>
                  <li>Interactive learning materials</li>
                  <li>Progress tracking and assessments</li>
                  <li>Student-instructor communication tools</li>
                  <li>Certification and completion records</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Registration and Account</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access certain features of our platform, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
                <p className="text-gray-700 leading-relaxed mb-4">You agree not to use the service to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Upload, post, or transmit any content that is unlawful, harmful, or offensive</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Attempt to gain unauthorized access to any part of the service</li>
                  <li>Share your account credentials with others</li>
                  <li>Use the platform for any commercial purposes without authorization</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content on Success Academy, including but not limited to text, graphics, logos, images, audio
                  clips, video clips, and software, is the property of Success Academy or its content suppliers and is
                  protected by Ethiopian and international copyright laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not reproduce, distribute, modify, or create derivative works of any content without explicit
                  written permission from Success Academy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment and Refund Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">For paid courses and services:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>All fees are stated in Ethiopian Birr (ETB) unless otherwise specified</li>
                  <li>Payment is required before accessing premium content</li>
                  <li>Refunds may be provided within 7 days of purchase for unused courses</li>
                  <li>Refund requests must be submitted through our official channels</li>
                  <li>We reserve the right to modify pricing with reasonable notice</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                  service, to understand our practices regarding the collection, use, and disclosure of your personal
                  information.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  Success Academy shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses, resulting from your use of the service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Use shall be governed by and construed in accordance with the laws of the Federal
                  Democratic Republic of Ethiopia. Any disputes arising under these terms shall be subject to the
                  exclusive jurisdiction of Ethiopian courts.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes
                  via email or through our platform. Your continued use of the service after such modifications
                  constitutes acceptance of the updated terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Use, please contact us at:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    <strong>Success Academy</strong>
                  </p>
                  <p className="text-gray-700">Website: successacademy.et</p>
                  <p className="text-gray-700">Email: bethlehemtsegaye14@gmail.com</p>
                  {/* <p className="text-gray-700">Email: info@successacademy.et</p> */}
                  <p className="text-gray-700">Location: Ethiopia</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
