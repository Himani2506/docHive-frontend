"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bot, User, Send, Upload, Brain, FileText, X, MessageSquare, FileCheck } from "lucide-react";


function ChatPage() {
    const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I can help you analyze your documents. Please upload one to get started.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentMetadata, setDocumentMetadata] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ✅ FIX: Added missing documentInfo
  const [documentInfo, setDocumentInfo] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // ✅ Remove uploaded file from list
  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // ✅ Upload & backend logic
  const processFile = async (file) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      setDocumentMetadata({ fileName: file.name });

      // ✅ Save uploaded file info
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toLocaleTimeString(),
        },
      ]);

      // ✅ Extract insights from backend
      const summary =
        json.document_analysis?.abstractive_summary ||
        "Document analyzed successfully.";

      setDocumentInfo({
        title: file.name,
        documentType: json.document_type || "Unknown",
        summary,
        keyTopics: json.key_topics || ["AI", "Legal", "Summary"],
        themes: json.themes || ["Insights", "Structure"],
        extractedEntities: json.entities || [],
      });

      localStorage.setItem("documentContext", JSON.stringify(json));

      // ✅ Show bot message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: `I've analyzed "${file.name}". Summary: ${summary}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: "Error analyzing document. Try again.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) processFile(file);
  };

  // ✅ Drag & drop upload
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) await processFile(file);
  };

  // ✅ Chat logic
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const savedContext = localStorage.getItem("documentContext");
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          documentContext: savedContext ? JSON.parse(savedContext) : null,
          conversationHistory: messages.slice(-10),
        }),
      });
      const data = await response.json();
      let botText = typeof data === "string" ? data : data.response;
      if (botText) {
        botText = botText
          .replace(/^```[a-zA-Z]*\n?/, "")
          .replace(/```$/, "")
          .trim();
      }

      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: botText || "Sorry, I couldn't process that right now.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content: "An error occurred. Try again later.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-1 h-full p-6 bg-gray-50 overflow-auto">
      <div className="w-full mx-auto h-full flex flex-col overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-michroma text-3xl text-gray-900 mb-2">Document Assistant</h1>
          <p className="text-gray-600">Upload documents and chat with AI to extract insights and information</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6 flex-1 overflow-auto">
          
          {/* Document Upload Container */}
          <div className="xl:col-span-1 lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer mb-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="mx-auto h-8 w-8 lg:h-12 lg:w-12 mb-4 animate-spin">
                        <Brain className="w-full h-full text-blue-500" />
                      </div>
                      <p className="text-blue-600 mb-2 text-sm lg:text-base">Analyzing document with AI...</p>
                      <p className="text-xs lg:text-sm text-blue-500">Please wait while I process your document</p>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 lg:h-12 lg:w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2 text-sm lg:text-base">Click to upload or drag and drop</p>
                      <p className="text-xs lg:text-sm text-gray-500">PDF, DOC, DOCX, TXT files supported</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isAnalyzing}
                  />
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="flex-1 overflow-y-auto">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Uploaded Files</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB • {file.uploadedAt}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Container */}
          <div className="xl:col-span-1 lg:col-span-1 overflow-auto">
            <Card className="h-full flex flex-col overflow-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 overflow-auto">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} flex-1`}>
                        <div className={`max-w-[85%] p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={documentMetadata ? "Ask me about your document..." : "Upload a document first to start chatting..."}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isLoading || !documentMetadata}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!inputValue.trim() || isLoading || !documentMetadata}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Information Container */}
          <div className="xl:col-span-1 lg:col-span-2 overflow-auto">
            <Card className="h-full flex flex-col overflow-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Document Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {documentInfo ? (
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Document Overview</h4>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <p className="text-sm"><span className="font-medium">Title:</span> {documentInfo.title}</p>
                          <p className="text-sm"><span className="font-medium">Type:</span> {documentInfo.documentType}</p>
                          <p className="text-sm"><span className="font-medium">Status:</span> Uploaded to Gemma</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">AI Summary</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{documentInfo.summary}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {documentInfo.keyTopics.map((topic, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {documentInfo.themes && documentInfo.themes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Main Themes</h4>
                          <div className="flex flex-wrap gap-2">
                            {documentInfo.themes.map((theme, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Extracted Entities</h4>
                        <div className="space-y-2">
                          {documentInfo.extractedEntities && documentInfo.extractedEntities.length > 0 ? (
                            documentInfo.extractedEntities.map((entity, index) => (
                              <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                                {entity}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 italic">No entities extracted</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Document Metadata</h4>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                          <p><span className="font-medium">Type:</span> {documentInfo.documentType || 'Unknown'}</p>
                          <p><span className="font-medium">Processing:</span> Complete</p>
                          <p><span className="font-medium">AI Analysis:</span> ✓ Completed</p>
                          <p><span className="font-medium">File Upload:</span> ✓ Uploaded to Gemma</p>
                          {documentMetadata?.fileName && (
                            <p><span className="font-medium">File Name:</span> {documentMetadata.fileName}</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <FileCheck className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Document Selected</h3>
                    <p className="text-gray-500 text-sm">Upload a document to see insights and extracted information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
    
}

export default ChatPage;
