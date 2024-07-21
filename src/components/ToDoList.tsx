import React, { useState, useCallback } from "react";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<string>("");

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTask(event.target.value);
    },
    []
  );

  const addTask = useCallback(() => {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, newTask]);
      setNewTask("");
    } else {
      alert("Task cannot be empty!");
    }
  }, [newTask]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        addTask();
      }
    },
    [addTask]
  );

  const deleteTask = useCallback(
    (index: number) => {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    },
    [tasks]
  );

  const editTask = useCallback(
    (index: number, newTask: string) => {
      const updatedTasks = [...tasks];
      updatedTasks[index] = newTask;
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditingTask("");
    },
    [tasks]
  );

  const startEditingTask = useCallback(
    (index: number) => {
      setEditingIndex(index);
      setEditingTask(tasks[index]);
    },
    [tasks]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const oldIndex = tasks.findIndex((task) => task === active.id);
      const newIndex = tasks.findIndex((task) => task === over.id);

      if (oldIndex !== newIndex) {
        setTasks((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center font-serif">
      <div className="w-full bg-[#7df9ff] rounded-sm border-4 border-black max-w-md my-10 p-4 font-bold">
        <h1 className="text-center text-4xl p-4 my-8 bg-[#ffff00] border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] place-content-center">
          To-Do List
        </h1>
        <div className="flex gap-2 mb-4">
          <label htmlFor="new-task" className="sr-only">
            Enter a task
          </label>
          <input
            id="new-task"
            type="text"
            placeholder="Enter a task"
            className="w-96 border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#daf5f0] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            value={newTask}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            onClick={addTask}
            className="h-12 border-black border-2 p-2.5 bg-[#2fff2f] hover:bg-[#00ff00] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF]"
            disabled={!newTask.trim()}
            aria-label="Add task"
          >
            Add
          </button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tasks} strategy={rectSortingStrategy}>
            <ol className="flex flex-col gap-4">
              {tasks.map((task, index) => (
                <SortableItem key={task} id={task}>
                  <li
                    className="flex justify-between items-center gap-2 w-full bg-[#fa8cef] px-4 py-4 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] place-content-center"
                  >
                    {editingIndex === index ? (
                      <>
                        <label htmlFor={`edit-task-${index}`} className="sr-only">
                          Edit task
                        </label>
                        <input
                          key={`edit-task-${index}`}
                          id={`edit-task-${index}`}
                          type="text"
                          value={editingTask}
                          placeholder="Edit task"
                          onChange={(e) => setEditingTask(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              editTask(index, editingTask);
                            }
                          }}
                          className="w-full p-1 bg-transparent border-none focus:outline-none"
                        />
                      </>
                    ) : (
                      <span
                        className="w-full"
                        onDoubleClick={() => startEditingTask(index)}
                      >
                        {task}
                      </span>
                    )}
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        aria-label="Edit task"
                        onClick={() => startEditingTask(index)}
                        className="flex justify-center items-center border-black border-2 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#53f2fc] w-10 h-10"
                      >
                        <FaEdit />
                      </button>
                      <button
                        aria-label="Delete task"
                        onClick={() => deleteTask(index)}
                        className="flex justify-center items-center border-black border-2 bg-[#fd5e2e] hover:bg-[#ff531f] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#ff3c00] w-10 h-10"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </li>
                </SortableItem>
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default ToDoList;
