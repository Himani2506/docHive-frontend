"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, Save, Send, Plus, Trash2 } from 'lucide-react'

function page() {
  const [invoiceData, setInvoiceData] = useState({
    firstName: 'John',
    lastName: 'John',
    address: '123 Maple Street, Springfield, USA',
    invoiceNumber: 'INV-0231',
    currency: 'US Dollar',
    issuedDate: '',
    dueDate: '',
    clientName: 'Acme Corp',
    clientEmail: 'hi@acmecorp.com',
    clientAddress: '123 Maple Street, Springfield'
  })

  const [items, setItems] = useState([
    { id: 1, name: 'Website Design', qty: 1, cost: 49.00 },
    { id: 2, name: 'Logo', qty: 1, cost: 499.00 },
    { id: 3, name: '3D Animation', qty: 1, cost: 1232.00 },
    { id: 4, name: 'Framer Sub.', qty: 1, cost: 48.00 }
  ])

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.cost), 0)
  const tax = subtotal * 0.1
  const total = subtotal - tax

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', qty: 1, cost: 0 }])
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">New Invoice</h1>
          <p className="text-gray-600">Generate and send new invoice.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  Acme Corp
                  <span className="text-sm text-gray-500 ml-auto">hi@acmecorp.com</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Enter invoice details.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      value={invoiceData.firstName}
                      onChange={(e) => setInvoiceData({...invoiceData, firstName: e.target.value})}
                      placeholder="Ex. John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={invoiceData.lastName}
                      onChange={(e) => setInvoiceData({...invoiceData, lastName: e.target.value})}
                      placeholder="Ex. John"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    value={invoiceData.address}
                    onChange={(e) => setInvoiceData({...invoiceData, address: e.target.value})}
                    placeholder="Ex. 123 Maple Street, Springfield, USA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input 
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm">
                      <option>🇺🇸 US Dollar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issuedDate">Issued Date</Label>
                    <Input 
                      id="issuedDate"
                      type="date"
                      value={invoiceData.issuedDate}
                      onChange={(e) => setInvoiceData({...invoiceData, issuedDate: e.target.value})}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <p className="text-sm text-gray-600">Enter product details.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2">QTY</div>
                    <div className="col-span-2">Cost</div>
                    <div className="col-span-2">Total</div>
                  </div>

                  {/* Items */}
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-1">
                        <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded"></div>
                      </div>
                      <div className="col-span-5">
                        <Input 
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          type="number"
                          value={item.cost}
                          onChange={(e) => updateItem(item.id, 'cost', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1 text-sm font-medium">
                        ${(item.qty * item.cost).toFixed(2)}
                      </div>
                      <div className="col-span-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="outline" 
                    onClick={addItem}
                    className="w-full gap-2 mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div>
            <Card className="sticky top-6">
              <CardContent className="p-8">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Invoice</h2>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Invoice Number:</span> {invoiceData.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">📄</span>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2">Billed by:</h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">John Jacobs</p>
                      <p className="text-gray-600">hjacobs@gmail.com</p>
                      <p className="text-gray-600">123 Maple Street, Springfield</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Billed to:</h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">Acme Corp</p>
                      <p className="text-gray-600">hi@acmecorp.com</p>
                      <p className="text-gray-600">123 Maple Street, Springfield</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm font-medium">Date Issued:</p>
                    <p className="text-sm text-gray-600">Jul 28, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Due Date:</p>
                    <p className="text-sm text-gray-600">Jul 31, 2025</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium border-b pb-2 mb-4">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2 text-right">Cost</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 text-sm py-2">
                      <div className="col-span-6">{item.name}</div>
                      <div className="col-span-2 text-center">{item.qty}</div>
                      <div className="col-span-2 text-right">${item.cost.toFixed(2)}</div>
                      <div className="col-span-2 text-right">${(item.qty * item.cost).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>10%(-${tax.toFixed(2)})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>TOTAL</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer Message */}
                <div className="mt-8 text-xs text-gray-500">
                  <p>Thank you for your purchase! We appreciate your business and look forward to serving you again.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page