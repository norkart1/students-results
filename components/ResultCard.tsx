"use client"

interface Subject {
  name: string
  nameArabic: string
  writtenMarks: number
  ceMarks: number
  totalMarks: number
  maxWritten: number
  maxCE: number
}

interface ResultCardProps {
  examTitle: string
  className: string
  student: {
    regNumber: string
    name: string
  }
  subjects: Subject[]
  grandTotal: number
  maxTotal: number
  rank: number
  percentage: number
}

export default function ResultCard({
  examTitle,
  className,
  student,
  subjects,
  grandTotal,
  maxTotal,
  rank,
  percentage,
}: ResultCardProps) {
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-700" }
    if (percentage >= 80) return { grade: "A", color: "text-green-600" }
    if (percentage >= 70) return { grade: "B+", color: "text-blue-600" }
    if (percentage >= 60) return { grade: "B", color: "text-blue-500" }
    if (percentage >= 50) return { grade: "C+", color: "text-yellow-600" }
    if (percentage >= 40) return { grade: "C", color: "text-orange-500" }
    return { grade: "F", color: "text-red-600" }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-700 bg-green-50"
    if (percentage >= 60) return "text-blue-700 bg-blue-50"
    if (percentage >= 40) return "text-yellow-700 bg-yellow-50"
    return "text-red-700 bg-red-50"
  }

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return "st"
    if (rank === 2) return "nd"
    if (rank === 3) return "rd"
    return "th"
  }

  const gradeInfo = getGrade(percentage)

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-8 print:bg-blue-800">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AS</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{examTitle}</h1>
          </div>
        </div>
      </div>

      {/* Student Info Section */}
      <div className="bg-gray-50 px-8 py-6 border-b-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Student Name</label>
                <p className="text-2xl font-bold text-gray-900">{student.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Class</label>
                <p className="text-lg font-semibold text-gray-800">{className}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Registration No.</label>
              <p className="text-xl font-bold text-blue-600">{student.regNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Examination</label>
              <p className="text-sm font-medium text-gray-700">First Semester 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-1 h-6 bg-blue-600 mr-3"></div>
          Subject-wise Performance
        </h2>

        <div className="space-y-4 mb-8">
          {subjects.map((subject, index) => {
            const subjectPercentage = (subject.totalMarks / (subject.maxWritten + subject.maxCE)) * 100
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Subject Name */}
                  <div className="md:col-span-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{subject.name}</h3>
                    <p
                      className="text-lg arabic-text text-blue-700 mt-1"
                      style={{ fontFamily: "Noto Sans Arabic, Arial, sans-serif" }}
                    >
                      {subject.nameArabic}
                    </p>
                  </div>

                  {/* Marks Breakdown */}
                  <div className="md:col-span-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Written</label>
                        <div
                          className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(subject.writtenMarks, subject.maxWritten)}`}
                        >
                          {subject.writtenMarks}/{subject.maxWritten}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">CE</label>
                        <div
                          className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(subject.ceMarks, subject.maxCE)}`}
                        >
                          {subject.ceMarks}/{subject.maxCE}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Total</label>
                        <div
                          className={`text-xl font-bold px-2 py-1 rounded ${getScoreColor(subject.totalMarks, subject.maxWritten + subject.maxCE)}`}
                        >
                          {subject.totalMarks}/{subject.maxWritten + subject.maxCE}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="md:col-span-2">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-600 mb-1">{subjectPercentage.toFixed(1)}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            subjectPercentage >= 80
                              ? "bg-green-500"
                              : subjectPercentage >= 60
                                ? "bg-blue-500"
                                : subjectPercentage >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(subjectPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            Overall Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide block mb-2">
                  Total Marks
                </label>
                <div className="text-3xl font-bold text-blue-600">{grandTotal}</div>
                <div className="text-sm text-gray-500">out of {maxTotal}</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide block mb-2">
                  Percentage
                </label>
                <div className={`text-3xl font-bold ${gradeInfo.color}`}>{percentage}%</div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide block mb-2">Grade</label>
                <div className={`text-3xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                <div className="text-sm text-gray-500">Letter Grade</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide block mb-2">
                  Class Rank
                </label>
                <div className="text-3xl font-bold text-purple-600">
                  {rank}
                  <span className="text-lg">{getRankSuffix(rank)}</span>
                </div>
                <div className="text-sm text-gray-500">Position</div>
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-600 uppercase tracking-wide block mb-3">
              Overall Performance
            </label>
            <div className="w-full bg-gray-200 rounded-full h-4 relative">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  percentage >= 80
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : percentage >= 60
                      ? "bg-gradient-to-r from-blue-400 to-blue-600"
                      : percentage >= 40
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Performance Analysis</h3>
            <p className="text-sm text-gray-700">
              {percentage >= 80
                ? "Excellent performance! Keep up the outstanding work."
                : percentage >= 60
                  ? "Good performance with room for improvement in some subjects."
                  : percentage >= 40
                    ? "Satisfactory performance. Focus on weaker subjects for better results."
                    : "Needs significant improvement. Consider additional support and practice."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Date & Signature</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Result Published: {new Date().toLocaleDateString()}</p>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">Principal's Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-8 py-4 text-center border-t">
        <p className="text-sm text-gray-600">
          This is a computer-generated result. For any queries, please contact the examination department.
        </p>
      </div>
    </div>
  )
}
