/** @jsxImportSource @emotion/react */

import { css, Global } from '@emotion/react';
import { useEffect, useState } from 'react';

export default function SurveyYourWay() {
  const [surveyElementsArray, setSurveyElementsArray] = useState([
    { deleted: false, question: '', typeOfResponse: 0 },
  ]);
  const [answerElementsArray, setAnswerElementsArray] = useState<Array<string>>(
    [],
  );
  const [title, setTitle] = useState('');

  //!! serves as placeholder for authentication logic. Set to 'false' to see an example survey instead of the survey-creator
  const [isAdmin, setIsAdmin] = useState(false);

  type SurveyToFillOut =
    | {
        title: String;
        questions: {
          questionNumber: number;
          question: string;
          typeOfResponse: number;
        }[];
      }
    | {};

  const [surveyToFillOut, setSurveyToFillOut] = useState<SurveyToFillOut>({});

  // !! replace the logic inside the useEffect with a http request to retrieve a survey from your db
  useEffect(() => {
    if (!isAdmin) {
      setSurveyToFillOut({
        title: 'An example survey',
        questions: [
          { questionNumber: 1, question: 'Question 1?', typeOfResponse: 1 },
          { questionNumber: 2, question: 'Question 2?', typeOfResponse: 2 },
          { questionNumber: 3, question: 'Question 3?', typeOfResponse: 3 },
        ],
      });
    }
  }, []);

  const sendData = () => {
    // filtering out elements with deleted === true (have been deleted) or empty questions
    const surveyElementsToInclude = surveyElementsArray.filter((element) => {
      return !element.deleted && element.question;
    });
    // create a new array of objects that contain an id (questionNumber), the question, and the response-type (which is set to 1 if it was 0)
    const finishedSurveyData = {
      title: title,
      questions: surveyElementsToInclude.map((element, index) => {
        return {
          questionNumber: index + 1,
          question: element.question,
          typeOfResponse: element.typeOfResponse || 1,
        };
      }),
    };
    //!! include http-request for handling finishedSurveyData
    console.log('finishedSurveyData: ', finishedSurveyData);
  };

  const submitFilledOutSurvey = () => {
    //!! include http-request for handling answerElementsArray
    //!! similar to sendCreatedSurveyData
    console.log('answers: :', answerElementsArray);
  };

  if (isAdmin) {
    return (
      <>
        <Global styles={globalStyles} />
        <div css={appStyles}>
          <button className="close" />
          <div className="logo" />
          <div className="survey-container">
            <h1>
              Welcome to <i>Survey Your Way</i>
            </h1>
            <p>This company's tool for creating surveys fast.</p>

            <label htmlFor="title-input">Title</label>
            <input
              id="title-input"
              onChange={(e) => setTitle(e.currentTarget.value)}
              value={title}
            />
            {surveyElementsArray.map((element, index) => {
              if (element.deleted) return;
              return (
                <SurveyElement
                  setSurveyElementsArray={setSurveyElementsArray}
                  index={index}
                  // as elements always get pushed to the end of the array and none deleted, using the index for the key-prop is valid
                  key={`survey-element-no-${index / 10}`}
                />
              );
            })}
            <button
              className="add-question-button"
              onClick={() =>
                setSurveyElementsArray((prev) =>
                  prev.concat({
                    deleted: false,
                    question: '',
                    typeOfResponse: 0,
                  }),
                )
              }
            >
              add question
            </button>
            <button className="done-button" onClick={sendData}>
              Done!
            </button>
          </div>
        </div>
      </>
    );
  } else {
    // non-admin's view
    return (
      <>
        <Global styles={globalStyles} />
        <div css={appStyles}>
          <button className="close" />
          <div className="logo" />
          <div className="survey-container">
            <h1>
              Welcome to <i>Survey Your Way</i>
            </h1>
            <p>This company's tool for filling out surveys fast.</p>

            <p>
              <b>{'title' in surveyToFillOut ? surveyToFillOut.title : null}</b>
            </p>
            {'questions' in surveyToFillOut
              ? surveyToFillOut.questions.map((question) => {
                  return (
                    <AnswerElement
                      question={question}
                      key={`${question.questionNumber}`}
                      setAnswerElementsArray={setAnswerElementsArray}
                      answerElementsArray={answerElementsArray}
                    />
                  );
                })
              : null}
            <button className="done-button" onClick={submitFilledOutSurvey}>
              Done!
            </button>
          </div>
        </div>
      </>
    );
  }
}

type SurveyElementProps = {
  setSurveyElementsArray: React.Dispatch<
    React.SetStateAction<
      { deleted: boolean; question: string; typeOfResponse: number }[]
    >
  >;
  index: number;
};

const SurveyElement = (props: SurveyElementProps) => {
  const [question, setQuestion] = useState('');
  const [typeOfResponse, setTypeOfResponse] = useState(0);

  // include information about question and response type in surveyElementsArray when changed

  useEffect(() => {
    props.setSurveyElementsArray((prev) => {
      return prev.map((element, index) => {
        if (index !== props.index) return element;
        return {
          deleted: false,
          question: question,
          typeOfResponse: typeOfResponse,
        };
      });
    });
  }, [question, typeOfResponse]);

  return (
    <div css={surveyElementStyles}>
      <div>
        <label htmlFor="question-input">Question</label>
        <input
          id="question-input"
          value={question}
          onChange={(e) => setQuestion(e.currentTarget.value)}
        />
      </div>
      <div>
        <label htmlFor="type-of-response-select">Type of Response</label>
        <select
          id="type-of-response-select"
          onChange={(e) => setTypeOfResponse(Number(e.currentTarget.value))}
          value={typeOfResponse}
        >
          <option value={1}>text-field</option>
          <option value={2}>scale</option>
          <option value={3}>check-mark</option>
        </select>
      </div>
      <button
        className="delete-button"
        onClick={() => {
          // when a surveyElement gets deleted, set its 'deleted' property to true
          // deleted surveyElement will stay in the array
          props.setSurveyElementsArray((prev) => {
            return prev.map((element, index) => {
              if (index !== props.index) return element;
              return {
                deleted: true,
                question: element.question,
                typeOfResponse: element.typeOfResponse,
              };
            });
          });
        }}
      />
    </div>
  );
};

type AnswerElementProps = {
  setAnswerElementsArray: React.Dispatch<React.SetStateAction<string[]>>;
  answerElementsArray: string[];
  question: {
    questionNumber: number;
    question: string;
    typeOfResponse: number;
  };
};

const AnswerElement = (props: AnswerElementProps) => {
  const [answer, setAnswer] = useState('');
  // update the Array containing all answers on the correct index when an answer is changed
  useEffect(() => {
    const newArray = [...props.answerElementsArray];
    newArray[props.question.questionNumber - 1] = answer;
    props.setAnswerElementsArray(newArray);
  }, [answer]);
  //

  return (
    <div css={answerElementStyles}>
      <p>{props.question.question}</p>
      {props.question.typeOfResponse === 1 ? (
        <input
          name={`question-no-${props.question.questionNumber}-input`}
          onChange={(e) => setAnswer(e.currentTarget.value)}
          value={answer}
        ></input>
      ) : props.question.typeOfResponse === 2 ? (
        <div>
          <input
            type="radio"
            name={`question-no-${props.question.questionNumber}-input`}
            value={1}
            onChange={(e) => setAnswer(e.currentTarget.value)}
          />
          <input
            type="radio"
            name={`question-no-${props.question.questionNumber}-input`}
            value={2}
            onChange={(e) => setAnswer(e.currentTarget.value)}
          />
          <input
            type="radio"
            name={`question-no-${props.question.questionNumber}-input`}
            value={3}
            onChange={(e) => setAnswer(e.currentTarget.value)}
          />
          <input
            type="radio"
            name={`question-no-${props.question.questionNumber}-input`}
            value={4}
            onChange={(e) => setAnswer(e.currentTarget.value)}
          />
          <input
            type="radio"
            name={`question-no-${props.question.questionNumber}-input`}
            value={5}
            onChange={(e) => setAnswer(e.currentTarget.value)}
          />
        </div>
      ) : (
        <input
          type="checkbox"
          name={`question-no-${props.question.questionNumber}-input`}
          onChange={() => setAnswer((prev) => (prev === 'yes' ? 'no' : 'yes'))}
        />
      )}
    </div>
  );
};

export const globalStyles = css`
  * {
    box-sizing: border-box;
  }
  body,
  html {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  label {
    font-size: 16px;
    font-weight: bold;
  }
  button {
    &:hover {
      cursor: pointer;
    }
  }
  input {
    height: 32px;
    font-size: 20px;
  }
`;
const appStyles = css`
  height: 100vh;
  width: 1000px;
  background-color: #1e758d;
  padding: 50px;

  .close {
    position: absolute;
    left: 930px;
    top: 20px;
    background: url('/close-icon.png');
    background-size: contain;
    width: 50px;
    height: 50px;
    border: 0;
  }

  .logo {
    background: url('/logo.png') no-repeat center center;
    background-size: cover;
    height: 200px;
    width: 400px;
  }
  .survey-container {
    background: white;
    width: 900px;
    height: 50vh;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow-y: scroll;

    h1 {
      margin-bottom: 0;
    }
    p {
      margin-top: 0;
      font-size: 20px;
    }

    #title-input {
      margin-top: 10px;
      width: 400px;
      margin-bottom: 20px;
    }
    .add-question-button {
      background: url('/plus-icon.png') no-repeat left center;
      background-size: contain;
      height: 40px;
      width: max-content;
      text-indent: 50px;
      margin-top: 20px;
      font-size: 20px;
      border: 0;
    }
    .done-button {
      height: 40px;
      background: #ffd76f;
      width: max-content;
      font-size: 20px;
      font-weight: bold;
      align-self: flex-end;
      margin-top: auto;
    }
    .answer-element {
      display: flex;
      > p {
        margin-right: 100px;
      }
    }
  }
`;

const surveyElementStyles = css`
  display: flex;
  width: 100%;
  margin-top: 20px;
  gap: 40px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 400px;
    height: max-content;
    input {
      width: 100%;
    }
    &:nth-of-type(2) {
      width: 200px;
      select {
        width: 100%;
        height: 32px;
      }
    }
  }
  .delete-button {
    width: 32px;
    height: 32px;
    align-self: flex-end;
    margin-left: 20px;
    background: url('/delete-icon.png') no-repeat center center;
    background-size: contain;
    border: 0;
  }
`;

const answerElementStyles = css`
  display: flex;
  > p {
    margin-right: 100px;
    width: 200px;
  }
`;
