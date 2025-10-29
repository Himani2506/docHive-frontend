"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function Page() {
  const [documentData, setDocumentData] = useState(null)

  useEffect(() => {
    // Fetch or load your stored JSON (example: from localStorage or API)
    const storedContext = localStorage.getItem("documentContext")
    if (storedContext) {
      setDocumentData(JSON.parse(storedContext))
    }
  }, [])

  if (!documentData) {
    return (
      <div className="flex h-[100svh] items-center justify-center text-gray-500">
        No document context found. Please upload and process a file first.
      </div>
    )
  }

  const { document_analysis, key_data_points, key_clauses, key_deadlines, legal_terminology } = documentData

  return (
    <div className="h-[100svh] overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Document Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">📄 Document Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><strong>Predicted Type:</strong> {document_analysis?.predicted_document_type || "N/A"}</p>
            <p><strong>Summary:</strong> {document_analysis?.abstractive_summary || "No summary available."}</p>

            <div>
              <strong>Keywords:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {(document_analysis?.keywords || []).map((kw, idx) => (
                  <Badge key={idx} variant="secondary">{kw}</Badge>
                ))}
              </div>
            </div>

            <div>
              <strong>Themes:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {(document_analysis?.themes || []).map((theme, idx) => (
                  <Badge key={idx} variant="outline">{theme}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Data Points */}
        {key_data_points?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">📌 Key Data Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {key_data_points.map((data, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                  <p><strong>Label:</strong> {data.label || "N/A"}</p>
                  <p><strong>Entity Type:</strong> {data.entity_type || "N/A"}</p>
                  <div className="mt-2">
                    <strong>Attributes:</strong>
                    <ul className="list-disc ml-6">
                      {(data.attributes || []).map((attr, i) => (
                        <li key={i}>{attr.key}: {attr.value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Key Clauses */}
        {key_clauses?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">📑 Key Clauses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {key_clauses.map((clause, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                  <p><strong>Clause Type:</strong> {clause.clause_type || "N/A"}</p>
                  <p><strong>Summary:</strong> {clause.summary || "N/A"}</p>
                  <p><strong>Layman Implication:</strong> {clause.layman_implication || "N/A"}</p>

                  <div className="mt-2">
                    <strong>Analysis:</strong>
                    <ul className="list-disc ml-6">
                      {(clause.analysis || []).map((a, i) => (
                        <li key={i}>{a.type}: {a.value} — {a.details}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Key Deadlines */}
        {key_deadlines?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">🗓️ Key Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {key_deadlines.map((deadline, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                  <p><strong>Date:</strong> {deadline.date || "N/A"}</p>
                  <p><strong>Event:</strong> {deadline.event || "N/A"}</p>
                  <p><strong>Explanation:</strong> {deadline.explanation || "N/A"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Legal Terminology */}
        {legal_terminology?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">⚖️ Legal Terminology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {legal_terminology.map((term, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                  <p><strong>Term:</strong> {term.term || "N/A"}</p>
                  <p><strong>Explanation:</strong> {term.explanation || "N/A"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Page
