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

  // Päivitä arvo, kun käyttäjä kirjoittaa kenttään
  const handleInputChange = (e) => {
    const newValue = Math.max(0, Math.min(100, Number(e.target.value)));
    setInputValue(newValue);
  };

  // Kentän tyhjentäminen ja arvon tallennus
  const handleInputBlur = () => {
    setPercentage(inputValue || 0); // Varmista, ettei jää tyhjäksi
    setIsEditing(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      setPercentage(inputValue || 0);
      setIsEditing(false);
    }
  };

  // Tyhjennä kenttä klikkauksen yhteydessä
  const handleInputFocus = () => {
    setInputValue(''); // Tyhjennä kenttä klikkauksen yhteydessä
  };

  // Hiiren vetämistoiminnallisuus (drag up/down)
  const handleMouseDown = (e) => {
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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Laske täytettyjen ruutujen määrä
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
        onClick={() => setPercentage(Math.round((bottomUpIndex / (GRID_SIZE * GRID_SIZE)) * 100))}
      ></div>
    );
  });

  return (
    <div onMouseDown={handleMouseDown}>
      <div className="percentage-display">
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
          <span onClick={() => setIsEditing(true)}>amount {percentage}%</span>
        )}
      </div>
      <div className="grid-container">{gridItems}</div>
    </div>
  );
}

export default Grid;
