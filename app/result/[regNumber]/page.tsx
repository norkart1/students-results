"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ResultCard from "@/components/ResultCard"
import { Button } from "@/components/ui/button"
import { Download, PrinterIcon as Print, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

interface ScoringComponent {
  key: string;
  label: string;
  max?: number;
  computed?: boolean;
}

interface ResultData {
  student: {
    regNumber: string;
    name: string;
  };
  batch: {
    name: string;
    examTitle: string;
  };
  subjects: Array<{
    subject: {
      name: string;
      nameArabic: string;
      scoringScheme: ScoringComponent[];
    };
    marks: Record<string, number>;
  }>;
  grandTotal: number;
  percentage: number;
  rank: number;
}

interface SubjectMark {
  subject: {
    name: string;
    nameArabic: string;
    scoringScheme: ScoringComponent[];
  };
  marks: Record<string, number>;
}

export default function ResultPage() {
  const params = useParams()
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    if (params.regNumber) {
      fetchResult(params.regNumber as string)
    }
  }, [params.regNumber])

  const fetchResult = async (regNumber: string) => {
    try {
      const response = await fetch(`/api/results/student/${regNumber}`)
      if (response.ok) {
        const data = await response.json()
        setResult(data)
      }
    } catch (error) {
      console.error("Failed to fetch result:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    setPrinting(true)
    // Add print-specific styles
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-area, .print-area * {
          visibility: visible;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        .print-break {
          page-break-before: always;
        }
        @page {
          margin: 0.5in;
          size: A4;
        }
      }
    `

    const styleSheet = document.createElement("style")
    styleSheet.innerText = printStyles
    document.head.appendChild(styleSheet)

    setTimeout(() => {
      window.print()
      document.head.removeChild(styleSheet)
      setPrinting(false)
    }, 100)
  }

  const handleDownload = async () => {
    if (typeof window === "undefined") return;
    setPrinting(true)
    try {
      const html2pdf = (await import("html2pdf.js"))?.default || (await import("html2pdf.js"));
      const element = document.querySelector(".print-area") as HTMLElement
      if (!element) {
        alert("Result content not found for PDF export.")
        return
      }
      await html2pdf()
        .set({
          margin: 0, // No margin for full A4 coverage
          filename: `Result_${result?.student.regNumber}.pdf`,
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#fff', windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ['css', 'legacy'], before: '.pdf-pagebreak', after: undefined, avoid: ['.no-break'] },
          image: { type: 'jpeg', quality: 0.98 },
        })
        .from(element)
        .save()
    } catch (err) {
      alert("Failed to generate PDF. Please try again.")
      console.error(err)
    } finally {
      setPrinting(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Result - ${result?.student.name}`,
          text: `Check out the examination result for ${result?.student.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Result link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">Loading result...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the examination result</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Result Not Found</h1>
          <p className="text-gray-600 mb-6">
            No examination result found for registration number: <strong>{params.regNumber}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Please check the registration number and try again, or contact the examination department for assistance.
          </p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // When mapping API data to subjects, transform to new structure:
  const subjects: SubjectMark[] = (result?.subjects || []).map((s) => ({
    subject: {
      name: s.subject.name,
      nameArabic: s.subject.nameArabic,
      scoringScheme: s.subject.scoringScheme,
    },
    marks: s.marks,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Action Bar */}
      <div className="no-print bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Link href="/">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="mt-2 sm:mt-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 break-words max-w-xs sm:max-w-none">{result.student.name}</h1>
                <p className="text-xs sm:text-sm text-gray-600 break-words">Reg: {result.student.regNumber}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button onClick={handleShare} variant="outline" size="sm" className="w-full sm:w-auto">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" disabled={printing}>
                <Print className="w-4 h-4 mr-2" />
                {printing ? "Preparing..." : "Print Result"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 print-area">
        <ResultCard
          examTitle={result.batch.examTitle}
          className={result.batch.name}
          student={result.student}
          subjects={subjects}
          grandTotal={result.grandTotal}
          maxTotal={subjects.length * 100}
          rank={result.rank}
          percentage={result.percentage}
        />
      </div>

      {/* Print-specific footer */}
      <div className="print:block hidden text-center text-xs text-gray-500 mt-4 sm:mt-8 px-2">
        Generated on {new Date().toLocaleString()} | ASAS MALIKI EXAMINATION SYSTEM
      </div>
    </div>
  )
}
