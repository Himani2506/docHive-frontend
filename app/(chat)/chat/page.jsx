"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, User, Send, Upload, Brain } from "lucide-react";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I can help you analyze your documents. Please upload one to get started.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentMetadata, setDocumentMetadata] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Upload & backend logic preserved
  const processFile = async (file) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://127.0.0.1:8000/upload", { method: "POST", body: formData });
      const json = await response.json();
      setDocumentMetadata({ fileName: file.name });
      const summary = json.document_analysis?.abstractive_summary || "Document analyzed successfully.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: `I've analyzed "${file.name}". Summary: ${summary.slice(0, 150)}...`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: "bot", content: "Error analyzing document. Try again.", timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) processFile(file);
  };

  // Drag & drop for quick upload
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const newMessage = { id: Date.now(), type: "user", content: inputValue, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const savedContext = localStorage.getItem('documentContext');
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          documentContext: savedContext ? JSON.parse(savedContext) : null,
          conversationHistory: messages.slice(-10),
        })
      });
      const data = await response.json();
      console.log("Chat response data:", data);
      console.log(JSON.stringify({
          message: currentInput,
          documentContext: savedContext ? JSON.parse(savedContext) : null,
          conversationHistory: messages.slice(-10),
        }))
      const botText = typeof data === "string" ? data : data.response;
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
        { id: Date.now() + 1, type: "bot", content: "An error occurred. Try again later.", timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0c0c] text-white px-4">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-4xl font-semibold text-gray-100">Document Assistant</h1>
        <Badge variant="outline" className="border-gray-700 text-gray-300">Beta</Badge>
      </div>

      {/* Chat Box */}
      <div
        className={`relative bg-[#1a1a1a]/90 backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1a]/70 border border-gray-700 rounded-2xl w-full max-w-3xl flex flex-col overflow-hidden shadow-xl`} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/50">
            <div className="rounded-xl border-2 border-dashed border-gray-400/70 px-6 py-4 bg-[#0c0c0c]/60 text-sm text-gray-200">
              Drop your file to upload
            </div>
          </div>
        )}
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === "user" ? "bg-gray-600" : "bg-gray-700"
                }`}
              >
                {msg.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm shadow-sm border ${
                    msg.type === "user"
                      ? "bg-gray-700 text-gray-50 border-transparent rounded-br-md"
                      : "bg-[#202020] text-gray-200 border-gray-700 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] mt-1 text-gray-400">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-gray-700 p-4 bg-[#121212]">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
                    aria-label="Upload document"
                  >
                    {isAnalyzing ? <Brain className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload document</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                documentMetadata ? "Ask about your document..." : "Upload a document to start chatting..."
              }
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading || !documentMetadata}
              className="flex-1 rounded-full bg-[#1f1f1f] border-gray-700 text-gray-200 placeholder-gray-500"
              aria-label="Type your message"
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading || !documentMetadata}
                      size="icon"
                      className="rounded-full bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-60"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {!documentMetadata && <TooltipContent>Upload a document to start chatting</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>

          {documentMetadata && !isLoading && (
            <div className="flex flex-wrap gap-2 mt-3">
              {["Summarize this document", "List key entities", "What is the main conclusion?", "Find dates and amounts"].map(
                (suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputValue(suggestion)}
                    className="px-3 py-1 rounded-full text-xs bg-[#1f1f1f] border border-gray-700 text-gray-300 hover:bg-[#242424] transition-colors"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
