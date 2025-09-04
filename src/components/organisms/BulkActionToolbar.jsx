import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const BulkActionToolbar = ({
  selectedCount = 0,
  isVisible = false,
  onMarkComplete,
  onArchive,
  onDelete,
  onClearSelection,
  onSelectAll
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{selectedCount}</span>
                </div>
                <span className="text-gray-700 font-medium">
                  {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
                </span>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkComplete}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <ApperIcon name="CheckCircle" size={16} className="mr-1.5" />
                  Complete
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onArchive}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <ApperIcon name="Archive" size={16} className="mr-1.5" />
                  Archive
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} className="mr-1.5" />
                  Delete
                </Button>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSelectAll}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                >
                  <ApperIcon name="CheckSquare" size={16} className="mr-1.5" />
                  All
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                >
                  <ApperIcon name="X" size={16} className="mr-1.5" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionToolbar;