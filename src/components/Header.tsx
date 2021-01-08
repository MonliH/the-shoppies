import React, { useState } from "react";
import styled from "styled-components";

import { LargeHeading, NormalText } from "components/Text";
import { CenteredHorizontalWrapper } from "components/Wrappers";

const HeadingNormalText = styled(NormalText)`
  text-align: center;
  @media (max-width: 700px) {
    width: 80vw;
    font-size: 18px;
  }
`;

const HeadingLogo = styled.img`
  width: 62px;
  height: 62px;
  margin-right: 25px;

  @media (max-width: 700px) {
    width: 40px;
    height: 40px;
    margin-right: 15px;
  }
`;

const HeadingHorizontalWrapper = styled(CenteredHorizontalWrapper)`
  margin-bottom: 10px;
  margin-top: 30px;
`;

const Header = () => {
  // If set to true, we render the emoji
  // If false, we render the svg logo
  // We use this for a fallback for the logo, so it always shows a trophy (of some sort)
  const [alt, setAlt] = useState(true);

  return (
    <div>
      <HeadingHorizontalWrapper>
        {alt ? (
          <LargeHeading style={{ marginRight: "25px" }}>
            <span role="img" aria-label="Trophy Logo">
              🏆
            </span>
          </LargeHeading>
        ) : (
          <></>
        )}
        <HeadingLogo
          alt="Logo"
          onError={() => setAlt(true)}
          onLoad={() => setAlt(false)}
          style={{ display: alt ? "none" : "block" }}
          src="/logo192.png"
        />
        <LargeHeading>The Shoppies</LargeHeading>
      </HeadingHorizontalWrapper>
      <HeadingNormalText>
        Nominate your top 5 movies for the Shopies award!
      </HeadingNormalText>
    </div>
  );
};
export default Header;
