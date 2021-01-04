import styled from "styled-components";

export const fontSans =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen","Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';

export const LargeHeading = styled.h1`
  font: bold 60px ${fontSans};
  @media (max-width: 940px) {
    font-size: 50px;
  }
  @media (max-width: 700px) {
    font-size: 40px;
  }

  color: #262626;

  margin: 0;
  margin-bottom: 10px;
`;

export const MediumHeading = styled.h2`
  font: bold 25px ${fontSans};

  color: #292929;

  margin: 0;
  margin-bottom: 10px;
`;

export const SmallHeading = styled.h3`
  font: bold 18px ${fontSans};

  color: #363636;

  margin: 0;
  margin-bottom: 10px;
`;

export const Label = styled.label`
  font: bold 15px ${fontSans};
  color: #4b4b4b;
  display: block;
  margin-bottom: 7px;
`;

export const NormalText = styled.p`
  font: 20px ${fontSans};
  color: #3b3b3b;

  margin: 0;
  margin-bottom: 20px;
`;

export const NormalTextSmall = styled.p`
  font: 15px ${fontSans};
  color: #3b3b3b;

  margin: 0;
  margin-bottom: 3px;
`;
