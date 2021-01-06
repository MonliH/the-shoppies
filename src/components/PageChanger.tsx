import React from "react";
import styled from "styled-components";
import { ArrowLeft, ArrowRight } from "react-feather";

import { HorizontalWrapper } from "components/Wrappers";
import { NormalTextSmall } from "components/Text";

interface PageChangerProps {
  onNextPage: () => void;
  onPreviousPage: () => void;
  currentPage: number;
  totalPages: number;
}

const PageChangerWrapper = styled(HorizontalWrapper)`
  align-items: center;
  justify-content: center;
`;

const PaginationButton = styled.button`
  background: none;
  border: none;
  width: fit-content;
  height: fit-content;
`;

const PaginationText = styled(NormalTextSmall)`
  margin: 0px 5px;
`;

const PageChanger = ({
  onNextPage,
  onPreviousPage,
  currentPage,
  totalPages,
}: PageChangerProps) => {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  return (
    <PageChangerWrapper>
      <PaginationButton onClick={onPreviousPage} disabled={!hasPreviousPage}>
        <ArrowLeft />
      </PaginationButton>
      <PaginationText>
        Page <b>{currentPage}</b> of <b>{totalPages}</b>
      </PaginationText>
      <PaginationButton onClick={onNextPage} disabled={!hasNextPage}>
        <ArrowRight />
      </PaginationButton>
    </PageChangerWrapper>
  );
};
export default PageChanger;
