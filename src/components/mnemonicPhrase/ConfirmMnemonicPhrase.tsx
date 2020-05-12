import React, { useRef, useState } from "react";
import styled from "styled-components";
import { shuffle } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmMnemonicPhrase,
  applicationStateSelector,
} from "ducks/authServices";
import { APPLICATION_STATE } from "statics";
import CheckButton from "./primitives/CheckButton";

const ConfirmInput = styled.textarea`
  background: #d3d3d3;
  border: 0;
  border-radius: 5px;
  color: purple;
  font-size: 14px;
  padding: 20px 30px;
  width: 60%;
  margin-bottom: 20px;
`;

const ConfirmMnemonicPhrase = ({
  mnemonicPhrase,
}: {
  mnemonicPhrase: string;
}) => {
  const dispatch = useDispatch();
  const words = useRef(shuffle(mnemonicPhrase.split(" ")));
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const applicationState = useSelector(applicationStateSelector);

  const updatePhrase = (target: HTMLInputElement) => {
    if (target.checked) {
      return setSelectedWords((prevState) => [...prevState, target.value]);
    }
    return setSelectedWords((prevState) => {
      const currentArr = [...prevState];
      currentArr.splice(currentArr.indexOf(target.value), 1);
      return [...currentArr];
    });
  };

  const wordBubbles = () =>
    words.current.map((word) => (
      <CheckButton
        onChange={(e) => {
          updatePhrase(e.target);
        }}
        word={word}
      />
    ));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(confirmMnemonicPhrase(selectedWords.join(" ")));
  };
  console.log(applicationState);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <ConfirmInput readOnly value={selectedWords.join(" ")} />
          {applicationState === APPLICATION_STATE.MNEMONIC_PHRASE_FAILED ? (
            <p>"The secret phrase you entered is incorrect"</p>
          ) : null}
        </div>
        {wordBubbles()}
        <div>
          <button type="submit">Confirm</button>
        </div>
      </form>
    </>
  );
};

export default ConfirmMnemonicPhrase;