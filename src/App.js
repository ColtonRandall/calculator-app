/* eslint-disable default-case */
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

// Global variables
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EQUALS: "equals",
};

// Break action into `type` and `payload`
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // Make sure we can't add infinite zeros or periods -> a.k.a. don't make any changes
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        // spread out current state
        ...state,
        // replace it & add to end
        // Account for if currentOperand is null ("")
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      // Return an empty state to clear the calculator
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      // Return NOTHING if an operation is chosen FIRST, instead of a number
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      /* Scenario: You hit a symbol you didn't intend to, and want to overwrite it with
      the symbol you want
      */
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      // Take current input, make it previous, and set the operation
      if (state.previousOperand == null) {
        return {
          // spread out the state
          // set the operation as the thing we passed in
          // set previousOperand as currentOperand
          // set currentOperand to null
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      // The default will be if we use an operand a second time
      // The calculator should perform the calculation with whatever is currently on screen
      // Then, the result should appear as the previousOperand, and the currentOperand is empty
      return {
        ...state,
        previousOperand: equals(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EQUALS:
      // 1. Check that we have all the information we need to perform a calculation
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      // 2. If we have everything we need, perform the calculation
      else
        return {
          ...state,
          previousOperand: null, // We don't want anything to appear here
          operation: null,
          currentOperand: equals(state),
        };
  }
}

function equals({ currentOperand, previousOperand, operation }) {
  // 1. convert strings entered into number
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  // 2. If they don't exist, return an empty string - no calculation required
  // Otherwise, get computed value
  if (isNaN(previous) || isNaN(current)) return "";
  let computation = "";
  // 3. If calculation is required, switch through all different operations
  switch (operation) {
    // if operation is a +, perform add functionality etc.
    case "+":
      computation = previous + current;
      // enter a break so it doesn't go into next case statement
      break;
    case "-":
      computation = previous - current;
      break;
    case "x":
      computation = previous * current;
      break;
    case "÷":
      computation = previous / current;
  }
  return computation.toString();
}

function App() {
  // const [state, dispatch] = useReducer(reducer, initialArg, init);

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      {/* Clear the current input */}
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button>⌫</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="x" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EQUALS })}
      >
        =
      </button>
    </div>
  );
}

export default App;
