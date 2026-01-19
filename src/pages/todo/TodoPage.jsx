import React, { useState } from "react"
import { AppSidebar } from "@/components/AppSidebar"
import PageBreadcrumb from "@/components/PageBreadcrumb";
import SectionHeader from "@/components/SectionHeader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainPanel } from "@/components/panels/main-panel"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Search, ChevronLeft, ChevronRight, Plus, CheckCircle, Circle, Trash2 } from "lucide-react"
import { Shell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function TodoPage() {
  const [todos, setTodos] = useState(() => [
    { id: 1, text: "Order new stock of Paracetamol", completed: false, createdAt: Date.now() - 1000 * 60 * 60 * 24 },
    { id: 2, text: "Check expiry dates for antibiotics", completed: false, createdAt: Date.now() - 1000 * 60 * 30 },
    { id: 3, text: "Prepare monthly sales report", completed: true, createdAt: Date.now() - 1000 * 60 * 60 * 48 },
    { id: 4, text: "Schedule staff meeting", completed: false, createdAt: Date.now() - 1000 * 60 * 15 },
    { id: 5, text: "Clean pharmacy shelves", completed: true, createdAt: Date.now() - 1000 * 60 * 60 * 72 },
    { id: 6, text: "Update patient records", completed: false, createdAt: Date.now() - 1000 * 60 * 5 },
    { id: 7, text: "Follow up on pending invoices", completed: false, createdAt: Date.now() - 1000 * 60 * 60 * 12 },
    { id: 8, text: "Restock first aid kits", completed: false, createdAt: Date.now() - 1000 * 60 * 60 * 6 },
    { id: 9, text: "Review security camera footage", completed: true, createdAt: Date.now() - 1000 * 60 * 60 * 2 },
    { id: 10, text: "Organize prescription refills", completed: false, createdAt: Date.now() - 1000 * 60 * 10 },
    { id: 11, text: "Check inventory for cold medicines", completed: false, createdAt: Date.now() - 1000 * 60 * 20 },
    { id: 12, text: "Process new supplier delivery", completed: false, createdAt: Date.now() - 1000 * 60 * 40 },
    { id: 13, text: "Update pharmacy license", completed: true, createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5 },
    { id: 14, text: "Train new intern on POS system", completed: false, createdAt: Date.now() - 1000 * 60 * 60 * 3 },
    { id: 15, text: "Sanitize consultation room", completed: false, createdAt: Date.now() - 1000 * 60 * 25 },
  ])
  const [newTodoText, setNewTodoText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt-desc") // Default: Newest first
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const[isPanelOpen, setIsPanelOpen] = React.useState(false);
  const addTodo = () => {
    if (newTodoText.trim() !== "") {
      const newTodo = {
        id: Date.now(), // Simple unique ID
        text: newTodoText.trim(),
        completed: false,
        createdAt: Date.now(),
      }
      setTodos((prev) => [...prev, newTodo])
      setNewTodoText("")
      setIsAddModalOpen(false) // Close modal after adding
    }
  }

  const toggleTodoStatus = (id) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  // Filter and sort todos
  const filteredTodos = todos.filter((todo) => todo.text.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case "createdAt-desc":
        return b.createdAt - a.createdAt
      case "createdAt-asc":
        return a.createdAt - b.createdAt
      case "completed-first":
        return a.completed === b.completed ? 0 : a.completed ? -1 : 1
      case "incomplete-first":
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1
      case "text-asc":
        return a.text.localeCompare(b.text)
      case "text-desc":
        return b.text.localeCompare(a.text)
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedTodos.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTodos = sortedTodos.slice(startIndex, endIndex)

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (

<>

        {/* Main Content */}
        <div className="flex flex-1 flex-col p-1 pt-0">
          {/* Welcome Section */}
          <SectionHeader
            title="Your Daily Tasks"
            description="Keep track of your pharmacy duties and stay organized."
          />

          {/* Filter and Sort Bar */}

        {/* Filter and Sort Bar */}
<div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 -mx-4 mb-4 flex flex-col md:flex-row items-center gap-3 md:gap-4">
  

  
  {/* 2. Search Input */}
  <div className="relative w-full md:max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      type="text"
      placeholder="Search tasks..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-10 border-cyan-200 focus:border-cyan-500 w-full"
    />
    {searchTerm && (
      <button
        onClick={clearSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>

  {/* 3. Sort Dropdown */}
  <div className="w-full md:w-48">
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-full border-cyan-200 focus:border-cyan-500">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt-desc">Newest First</SelectItem>
        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
        <SelectItem value="completed-first">Completed First</SelectItem>
        <SelectItem value="incomplete-first">Incomplete First</SelectItem>
        <SelectItem value="text-asc">Alphabetical (A-Z)</SelectItem>
        <SelectItem value="text-desc">Alphabetical (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  </div>


{/* 'md:ml-auto' pushes this button to the far right, separating it from Search/Sort */}
  <div className="w-full md:w-auto md:ml-auto">
    <Button 
      onClick={() => setIsAddModalOpen(true)}
      className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add New Task
    </Button>
  </div>

</div>
          {/* Todo List */}
          <div className="flex-1 max-h-[calc(100vh-400px)] overflow-y-auto">
            {currentTodos.length > 0 ? (
              currentTodos.map((todo) => (
                <Card key={todo.id} className="mb-3 border-gray-100 hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTodoStatus(todo.id)}
                        className="text-gray-500 hover:text-cyan-600"
                        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {todo.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
                      <span className={`flex-1 text-gray-800 ${todo.completed ? "line-through text-gray-500" : ""}`}>
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No tasks found. Add a new task above!
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 mt-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({sortedTodos.length} total tasks)
              </span>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 bg-transparent"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
  

      {/* Add Task Dialog - Separated */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-blue-700">Create New Task</DialogTitle>
            <DialogDescription>
              Enter the details for your new todo item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="todoText">Task Description</Label>
              <Input
                id="todoText"
                placeholder="e.g., Order new stock"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addTodo()
                  }
                }}
                className="border-cyan-200 focus:border-cyan-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={addTodo}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

</>
       

  )
}