import React from 'react';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import SortableItem from './SortableItem'; 

interface DraggableTaskProps {
  task: string;
  index: number;
  isEditing: boolean;
  deleteTask: (index: number) => void;
  startEditingTask: (index: number) => void;
  editTask: (index: number, newTask: string) => void;
  editingTask: string;
  setEditingTask: (task: string) => void;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  index,
  isEditing,
  deleteTask,
  startEditingTask,
  editTask,
  editingTask,
  setEditingTask
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      editTask(index, editingTask);
    }
  };

  return (
    <SortableItem id={`task-${index}`}>
      <li
        className="flex items-center gap-2 font-bold text-xl p-2 w-96 px-8 py-4 bg-[#FFA6F6] border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] place-content-center"
      >
        {isEditing ? (
          <>
            <label htmlFor={`edit-task-${index}`} className="sr-only">Edit task</label>
            <input
              id={`edit-task-${index}`}
              type="text"
              value={editingTask}
              placeholder="Edit task"
              onChange={(e) => setEditingTask(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-1 border-black border-2"
            />
          </>
        ) : (
          <span className="w-full" onDoubleClick={() => startEditingTask(index)}>
            {task}
          </span>
        )}
        <button
          aria-label="Edit task"
          className="flex justify-center items-center border-black border-2 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#53f2fc] w-10 h-10"
          onClick={() => startEditingTask(index)}
        >
          <FaEdit />
        </button>
        <button
          aria-label="Delete task"
          className="flex justify-center items-center border-black border-2 bg-[#fd5e2e] hover:bg-[#ff531f] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#ff3c00] w-10 h-10"
          onClick={() => deleteTask(index)}
        >
          <FaRegTrashAlt />
        </button>
      </li>
    </SortableItem>
  );
};

export default DraggableTask;
