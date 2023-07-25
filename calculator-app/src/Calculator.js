import React, { useState } from "react";
import Button from "./Components/Button";
import Display from "./Components/Display";
import "./Styles/main.scss";

function Calculator() {
  const [displayValue, setDisplayValue] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleButtonPress = (label) => {
    setDisplayValue((prevValue) => prevValue + label);
  };

  const handleClear = () => {
    setDisplayValue("");
  };

  const handleEquals = () => {
    try {
      const operators = ["+", "-", "*", "/", "^"];
      const input = displayValue.replace(/\s+/g, "");
  
      // Separate negative numbers as a single token
      const tokens = input.split(/([\+\-\*\/\^\(\)])/).filter((token) => token.trim() !== "");
  
      // Function to get precedence of operators
      const getPrecedence = (operator) => {
        switch (operator) {
          case "+":
          case "-":
            return 1;
          case "*":
          case "/":
            return 2;
          case "^":
            return 3;
          default:
            return 0;
        }
      };
  
      // Function to convert infix to postfix notation (Shunting Yard algorithm)
      const infixToPostfix = (input) => {
        const outputQueue = [];
        const operatorStack = [];
  
        tokens.forEach((token) => {
          if (!isNaN(token)) {
            outputQueue.push(token);
          } else if (operators.includes(token)) {
            while (
              operatorStack.length > 0 &&
              getPrecedence(operatorStack[operatorStack.length - 1]) >= getPrecedence(token)
            ) {
              outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
          } else if (token === "(") {
            operatorStack.push(token);
          } else if (token === ")") {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
              outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.length === 0) {
              throw new Error("Mismatched parentheses");
            }
            operatorStack.pop(); // Pop '(' from the stack
          }
        });
  
        while (operatorStack.length > 0) {
          const operator = operatorStack.pop();
          if (operator === "(") {
            throw new Error("Mismatched parentheses");
          }
          outputQueue.push(operator);
        }
  
        return outputQueue;
      };
  
      const postfixTokens = infixToPostfix(input);
  
      const stack = [];
      postfixTokens.forEach((token) => {
        if (!isNaN(token)) {
          stack.push(parseFloat(token));
        } else if (operators.includes(token)) {
          const operand2 = stack.pop();
          const operand1 = stack.pop();
          switch (token) {
            case "+":
              stack.push(operand1 + operand2);
              break;
            case "-":
              stack.push(operand1 - operand2);
              break;
            case "*":
              stack.push(operand1 * operand2);
              break;
            case "/":
              stack.push(operand1 / operand2);
              break;
            case "^":
              stack.push(Math.pow(operand1, operand2));
              break;
            default:
              break;
          }
        }
      });
  
      if (stack.length !== 1) {
        throw new Error("Invalid expression");
      }
  
      setHistory((prevHistory) => [
        ...prevHistory,
        { expression: displayValue, result: stack[0] },
      ]);
  
      setDisplayValue(stack[0].toString());
    } catch (error) {
      setDisplayValue("ERROR");
    }
  };
  

  const handleBackspace = () => {
    setDisplayValue((prevDisplay) => {
      if (!prevDisplay || prevDisplay.length === 1) {
        return "0";
      } else {
        return prevDisplay.slice(0, -1);
      }
    });
  };

  const handleToggleSign = () => {
    setDisplayValue((prevDisplay) => {
      if (prevDisplay[0] === "-") {
        return prevDisplay.slice(1);
      } else {
        return "-" + prevDisplay;
      }
    });
  };

  const handleSquareRoot = () => {
    try {
      const result = Math.sqrt(parseFloat(displayValue));
      setDisplayValue(result.toString());
    } catch (error) {
      setDisplayValue("ERROR");
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleToggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <Display value={displayValue} />
        <div className="button-row">
          {/* Number Buttons */}
          <Button label="1" onClick={() => handleButtonPress("1")} />
          <Button label="2" onClick={() => handleButtonPress("2")} />
          <Button label="3" onClick={() => handleButtonPress("3")} />
          {/* Parentheses */}
          <Button label="(" onClick={() => handleButtonPress("(")} />
          <Button label=")" onClick={() => handleButtonPress(")")} />
        </div>
        <div className="button-row">
          <Button label="4" onClick={() => handleButtonPress("4")} />
          <Button label="5" onClick={() => handleButtonPress("5")} />
          <Button label="6" onClick={() => handleButtonPress("6")} />
          <Button label="+" onClick={() => handleButtonPress("+")} />
          <Button label="-" onClick={() => handleButtonPress("-")} />
        </div>
        <div className="button-row">
          <Button label="7" onClick={() => handleButtonPress("7")} />
          <Button label="8" onClick={() => handleButtonPress("8")} />
          <Button label="9" onClick={() => handleButtonPress("9")} />
          <Button label="*" onClick={() => handleButtonPress("*")} />
          <Button label="/" onClick={() => handleButtonPress("/")} />
        </div>
        <div className="button-row">
          {/* Scientific Functions */}
          <Button label="√" onClick={handleSquareRoot} />
          <Button label="0" onClick={() => handleButtonPress("0")} />
          <Button label="." onClick={() => handleButtonPress(".")} />
          <Button label="=" onClick={handleEquals} />
          <Button label="C" onClick={handleClear} />
        </div>
        <div className="button-row">
          {/* Additional Buttons */}
          <Button label="^" onClick={() => handleButtonPress("^")} />
          <Button label="←" onClick={handleBackspace} />
          <Button label="+/-" onClick={handleToggleSign} />
          <button className="history-button" onClick={handleToggleHistory}>
            {isHistoryOpen ? "Hide History" : "Show History"}
          </button>
        </div>
        {isHistoryOpen && (
          <div className="history-section">
            <h3>History</h3>
            <div className="history-list">
              {history.length > 0 ? (
                <>
                  <ul>
                    {history.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => setDisplayValue(item.expression)}
                      >
                        <span className="expression">
                          &nbsp;{item.expression} ={" "}
                        </span>
                        <span className="result">&nbsp;{item.result}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No History Available</p>
              )}
            </div>
            {history.length > 0 ? (
              <button
                className="clear-history-button"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
