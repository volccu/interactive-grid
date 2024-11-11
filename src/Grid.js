import React, { useState, useEffect, useRef } from "react";
import "./Grid.css";

const GRID_SIZE = 10;

function Grid() {
  const [percentage, setPercentage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(percentage);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);
  const initialValue = useRef(0);
  const inputRef = useRef(null);

  // Päivitetään arvo input-kentästä
  const handleInputChange = (e) => {
    const newValue = Math.max(0, Math.min(100, Number(e.target.value)));
    setInputValue(newValue);
  };

  const handleInputBlur = () => {
    setPercentage(inputValue || 0);
    setIsEditing(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      setPercentage(inputValue || 0);
      setIsEditing(false);
    }
  };

  const handleInputFocus = () => {
    setInputValue('');
  };

  // Hiiren vetäminen alas/ylös
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    initialY.current = e.clientY;
    initialValue.current = percentage;
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaY = initialY.current - e.clientY;
      let newValue = initialValue.current + Math.floor(deltaY / 2);
      newValue = Math.max(0, Math.min(100, newValue));
      setPercentage(newValue);
      setInputValue(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    initialY.current = e.touches[0].clientY;
    initialValue.current = percentage;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isDragging) {
      const deltaY = initialY.current - e.touches[0].clientY;
      let newValue = initialValue.current + Math.floor(deltaY / 2);
      newValue = Math.max(0, Math.min(100, newValue));
      setPercentage(newValue);
      setInputValue(newValue);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Funktio, joka laskee oikean prosenttiosuuden
  const handleClickOnGridItem = (index) => {
    const newPercentage = Math.ceil(((index + 1) / (GRID_SIZE * GRID_SIZE)) * 100);
    setPercentage(newPercentage);
    setInputValue(newPercentage);
  };

  // Kaksoisklikkaus nollaa arvon
  const handleDoubleClick = () => {
    setPercentage(0);
    setInputValue(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const filledSquares = Math.round((percentage / 100) * GRID_SIZE * GRID_SIZE);

  // Luo ruudukko
  const gridItems = Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const bottomUpIndex = (GRID_SIZE - row - 1) * GRID_SIZE + col;
    return (
      <div
        key={index}
        className={`grid-item ${bottomUpIndex < filledSquares ? "filled" : ""}`}
        onClick={() => handleClickOnGridItem(bottomUpIndex)}
      ></div>
    );
  });

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
      className="grid-wrapper no-select"
    >
      <div className="percentage-display no-select">
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            className="percentage-input"
            autoFocus
          />
        ) : (
          <span onClick={() => setIsEditing(true)}>
            amount <span className="clickable">{percentage}%</span>
          </span>
        )}
      </div>
      <div className="grid-container">{gridItems}</div>
    </div>
  );
}

export default Grid;
