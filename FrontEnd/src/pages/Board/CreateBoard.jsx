import Layout from "@/components/Layout";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, X, GripVertical, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

function CreateBoard() {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState(["Todo", "In Progress", "Done"]);
  const [newColumn, setNewColumn] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    if (columns.length === 0) {
      toast.error("Please add at least one column");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/board/create",
        { name, columns },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setName("");
        navigate("/board");
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to create board");
    }
  };

  const addColumn = () => {
    if (newColumn.trim() && !columns.includes(newColumn.trim())) {
      setColumns([...columns, newColumn.trim()]);
      setNewColumn("");
    } else if (columns.includes(newColumn.trim())) {
      toast.error("Column already exists");
    }
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addColumn();
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(90deg,hsl(var(--foreground)/.25)_0_1px,transparent_1px_40px),repeating-linear-gradient(0deg,hsl(var(--foreground)/.25)_0_1px,transparent_1px_40px)]" />
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8839dd]/10 border border-[#8839dd]/20 mb-6">
            <LayoutGrid className="w-8 h-8 text-[#8839dd]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Create New Board
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Set up your project board with custom columns to organize your
            workflow
          </p>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Decorative corners */}
          <span
            aria-hidden
            className="absolute -top-px right-12 h-4 w-4 rotate-45 bg-background border-t border-l border-border z-10"
          />
          <span
            aria-hidden
            className="absolute -bottom-px left-12 h-4 w-4 rotate-45 bg-background border-b border-r border-border z-10"
          />

          <div className="border border-border bg-card/50 backdrop-blur-sm rounded-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Board Name Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px bg-border flex-1" />
                  <Label className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <span className="text-[#8839dd]">◆</span>
                    Board Information
                  </Label>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="boardName"
                    className="text-sm font-mono uppercase tracking-wider"
                  >
                    Board Name
                  </Label>
                  <Input
                    id="boardName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Website Redesign Project"
                    className="transition-all duration-300 focus:border-[#8839dd]/50 h-12 text-base"
                    required
                  />
                </div>
              </div>

              {/* Columns Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px bg-border flex-1" />
                  <Label className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                    <span className="text-[#8839dd]">◆</span>
                    Board Columns
                  </Label>
                  <div className="h-px bg-border flex-1" />
                </div>

                {/* Existing Columns */}
                <div className="space-y-2">
                  {columns.map((column, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-3 p-3 border border-border rounded-lg bg-background/50 hover:border-[#8839dd]/30 transition-all duration-300"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="flex-1 font-mono text-sm">{column}</span>
                      <button
                        type="button"
                        onClick={() => removeColumn(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Column */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newColumn}
                    onChange={(e) => setNewColumn(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add new column..."
                    className="flex-1 transition-all duration-300 focus:border-[#8839dd]/50"
                  />
                  <Button
                    type="button"
                    onClick={addColumn}
                    variant="outline"
                    className="hover:border-[#8839dd]/50 hover:bg-[#8839dd]/10 hover:text-[#8839dd]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground font-mono">
                  💡 Tip: Press Enter to quickly add a column
                </p>
              </div>

              {/* Preview Section */}
              {columns.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-border flex-1" />
                    <Label className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                      <span className="text-[#8839dd]">◆</span>
                      Preview
                    </Label>
                    <div className="h-px bg-border flex-1" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {columns.map((column, index) => (
                      <div
                        key={index}
                        className="p-3 border border-[#8839dd]/20 rounded-lg bg-[#8839dd]/5 text-center"
                      >
                        <p className="text-xs font-mono uppercase tracking-wider text-[#8839dd]">
                          {column}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/board")}
                  className="flex-1 font-mono hover:border-[#8839dd]/50 hover:bg-[#8839dd]/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 font-mono bg-[#8839dd] text-white hover:bg-[#9d4ef5] transition-all duration-300 hover:shadow-lg hover:shadow-[#8839dd]/50 hover:-translate-y-0.5"
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Create Board
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-6 border border-border/50 rounded-lg bg-card/30">
          <h3 className="text-sm font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-[#8839dd]">◆</span>
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[#8839dd] mt-1">•</span>
              <span>
                Use clear, descriptive names for your board and columns
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8839dd] mt-1">•</span>
              <span>Common workflows: Todo → In Progress → Done</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8839dd] mt-1">•</span>
              <span>
                You can add or remove columns anytime after creating the board
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CreateBoard;
