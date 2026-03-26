/* Burbuja de ayuda para Sergio */
.hint-bubble {
    position: absolute;
    top: 20px;
    left: 20px;
    background: white;
    border: 3px solid #2980b9;
    padding: 15px;
    border-radius: 20px;
    width: 250px;
    z-index: 100;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
}

.hint-bubble::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 30px;
    border-width: 20px 20px 0;
    border-style: solid;
    border-color: white transparent;
}

#formula-drop-zone {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.9);
    padding: 15px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 50;
}

.controls {
    position: absolute;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 100;
}

#help-btn {
    background: #f39c12;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
}
