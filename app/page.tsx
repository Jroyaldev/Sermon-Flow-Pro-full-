import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Edit, Mic, Clock, Users, TrendingUp, FileText, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <BookOpen className="h-6 w-6 mr-2" />
          <span className="font-bold">Sermon Flow Pro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-10 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Prepare Powerful Sermons in Half the Time
              </h1>
              <p className="mx-auto max-w-[800px] text-lg text-gray-600 md:text-xl dark:text-gray-300">
                Join thousands of pastors who use sermon preparation tools to create impactful messages. Spend more time deepening your grasp of the text and with your family.
              </p>
              <Button size="lg" asChild className="mt-4">
                <Link href="/signup">Start Your Free 14 Day Trial</Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-10">Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Edit className="h-6 w-6 mb-2" />
                  <CardTitle>Intuitive Outlining</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Create structured sermon outlines with our easy-to-use interface.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BookOpen className="h-6 w-6 mb-2" />
                  <CardTitle>Comprehensive Research</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>We find the right questions and ideas to help you grasp the text more deeply.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Mic className="h-6 w-6 mb-2" />
                  <CardTitle>Practice Mode (Coming Soon)</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Refine your delivery with our built-in practice and timing tools. (Planned future feature)</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-6 w-6 mb-2" />
                  <CardTitle>Time Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Stay on track with customizable schedules and reminders.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-6 w-6 mb-2" />
                  <CardTitle>Sermon Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Easily store, organize, and access your past sermons for reference and inspiration.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Gain insights into your sermon preparation and delivery trends.</CardDescription>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-12">
              <Button asChild>
                <Link href="/signup" className="inline-flex items-center">
                  Experience These Features <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-10">What Your Future Self Will Say</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "I can't believe how much time I've saved with Sermon Flow Pro. My sermons are more impactful, and I have more time for my family and personal growth. It's been a game-changer for my ministry.",
                  author: "Future You"
                },
                {
                  quote: "The depth of research I can now achieve is incredible. I'm preaching with more confidence and insight than ever before. My congregation has noticed the difference, and it's all thanks to this tool.",
                  author: "Future You"
                },
                {
                  quote: "Sermon preparation used to be a source of stress. Now, it's a joy. I'm more organized, more inspired, and more effective in my preaching. I wish I had started using this years ago!",
                  author: "Future You"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold italic">"{testimonial.quote}"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-right font-medium">- {testimonial.author}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" asChild>
                <Link href="/signup">Start Your Journey to Better Sermons</Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-10">Pricing</h2>
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
              <Card className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription className="text-2xl font-bold">$20/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Advanced sermon preparation tools</li>
                    <li>Full research library access</li>
                    <li>Collaboration features</li>
                    <li>Analytics and insights</li>
                    <li>Priority support</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/login">Choose Plan</Link>
                  </Button>
                </div>
              </Card>
              <Card className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription className="text-xl font-semibold">Custom Solution for Churches</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>All Pro features</li>
                    <li>Multi-user accounts</li>
                    <li>Dedicated support</li>
                    <li>Custom integrations</li>
                    <li>Tailored to your church's needs</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </Card>
            </div>
            <div className="text-center mt-12">
              <p className="text-lg mb-4">Not sure which plan is right for you?</p>
              <Button asChild>
                <Link href="/signup">Try It Free for 14 Days</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Sermon Flow Pro. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}