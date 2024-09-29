'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Book, PenTool, History, BookOpen, Cross, MessageSquare, ChevronDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This is a simplified list of books. You should expand this to include all books of the Bible.
const bibleBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Matthew', 'Mark', 'Luke', 'John', 'Acts']

export default function ResearchPage() {
  const [selectedBook, setSelectedBook] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [studyGuide, setStudyGuide] = useState('')
  const [researchNotes, setResearchNotes] = useState('')
  const [historicalContext, setHistoricalContext] = useState('')
  const [literaryAnalysis, setLiteraryAnalysis] = useState('')
  const [theologicalInterpretation, setTheologicalInterpretation] = useState('')
  const [homilecticalApplication, setHomilecticalApplication] = useState('')

  const generateStudyGuide = async () => {
    // This is where you'd make an API call to generate the study guide
    // For now, we'll just set a placeholder text
    setStudyGuide(`Study guide for "${selectedBook} ${selectedChapter}":\n\n1. Introduction to ${selectedBook} ${selectedChapter}\n2. Key concepts\n3. Biblical references\n4. Application points`)
  }

  const generateSection = async (section: string, setter: (value: string) => void) => {
    // This is where you'd make an API call to generate the specific section
    // For now, we'll just set a placeholder text
    setter(`${section} for ${selectedBook} ${selectedChapter}:\n\n1. Point 1\n2. Point 2\n3. Point 3`)
  }

  // Generate an array of chapter numbers based on the selected book
  // This is a placeholder function. In a real application, you'd need to know the number of chapters for each book
  const getChapters = (book: string) => {
    const chapterCount = book === 'Psalms' ? 150 : 50 // Example: Psalms has 150 chapters, others default to 50
    return Array.from({ length: chapterCount }, (_, i) => (i + 1).toString())
  }

  return (
    <div className="flex h-screen bg-white font-semibold">
      {/* Main Content */}
      <div className="flex-1 p-10 space-y-6 overflow-y-auto">
        <h2 className="text-3xl font-bold">Research</h2>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Generate Study Guide</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={!selectedBook || !selectedChapter}>
                  Generate <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={generateStudyGuide}>
                  <Search className="mr-2 h-4 w-4" />
                  Generate Study Guide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Select onValueChange={setSelectedBook}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {bibleBooks.map(book => (
                      <SelectItem key={book} value={book}>{book}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedChapter} disabled={!selectedBook}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBook && getChapters(selectedBook).map(chapter => (
                      <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                <pre className="whitespace-pre-wrap">{studyGuide}</pre>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Historical and Cultural Context</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={!selectedBook || !selectedChapter}>
                    Generate <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => generateSection('Historical and Cultural Context', setHistoricalContext)}>
                    <History className="mr-2 h-4 w-4" />
                    Generate Context
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                <pre className="whitespace-pre-wrap">{historicalContext}</pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Literary Analysis</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={!selectedBook || !selectedChapter}>
                    Generate <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => generateSection('Literary Analysis', setLiteraryAnalysis)}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Generate Analysis
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                <pre className="whitespace-pre-wrap">{literaryAnalysis}</pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Theological Interpretation</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={!selectedBook || !selectedChapter}>
                    Generate <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => generateSection('Theological Interpretation', setTheologicalInterpretation)}>
                    <Cross className="mr-2 h-4 w-4" />
                    Generate Interpretation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                <pre className="whitespace-pre-wrap">{theologicalInterpretation}</pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Homiletical Application</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={!selectedBook || !selectedChapter}>
                    Generate <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => generateSection('Homiletical Application', setHomilecticalApplication)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Generate Application
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                <pre className="whitespace-pre-wrap">{homilecticalApplication}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Research Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Type your research notes here..." 
              className="h-[200px]"
              value={researchNotes}
              onChange={(e) => setResearchNotes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-72 bg-white p-6 shadow-lg">
        <div className="space-y-6">
          <h3 className="text-lg font-bold mb-4">Research Tools</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start text-left" size="lg">
              <Book className="mr-2 h-5 w-5" />
              Bible Concordance
            </Button>
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Theological Dictionary
            </Button>
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <PenTool className="mr-2 h-5 w-5" />
              Save Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}