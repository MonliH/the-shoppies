import React, { useRef } from "react";
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

const PageChanger = ({
  onNextPage,
  onPreviousPage,
  currentPage,
  totalPages,
}: PageChangerProps) => {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const savedPageNumber = useRef<number>(1);
  if (totalPages !== 0) {
    savedPageNumber.current = totalPages;
  }

  return (
    <PageChangerWrapper>
      <PaginationButton
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        aria-label="Previous Page"
        data-testid="previous-page"
      >
        <ArrowLeft />
      </PaginationButton>
      <NormalTextSmall>
        Page <b>{currentPage}</b> of <b>{savedPageNumber.current}</b>
      </NormalTextSmall>
      <PaginationButton
        onClick={onNextPage}
        disabled={!hasNextPage}
        aria-label="Next Page"
        data-testid="next-page"
      >
        <ArrowRight />
      </PaginationButton>
    </PageChangerWrapper>
  );
};
export default PageChanger;
