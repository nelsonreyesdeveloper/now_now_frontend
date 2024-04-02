import { Pagination as PaginationProps } from "@/types/types";

const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
}: PaginationProps) => {
  return (
    <div className="grid grid-cols-3  lg:gap-4 lg:w-5/12 mt-5">
      <button
        disabled={currentPage === 1}
        onClick={() => {
          handlePageChange(currentPage - 1);
        }}
        className={`bg-blue-600 text-white p-2 rounded-sm ${
          currentPage === 1
            ? "cursor-not-allowed bg-blue-200"
            : "cursor-pointer"
        }`}
      >
        Anterior
      </button>

      <div className="flex justify-around">
        {Array.from({ length: totalPages }, (_, i) =>
          totalPages > 3 ? (
            i === 0 || i === totalPages - 1 || i === currentPage - 1 ? (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white p-2 rounded-sm"
                    : "bg-blue-200 text-blue-600 p-2 rounded-sm"
                }`}
              >
                {i + 1}
              </button>
            ) : i === currentPage - 2 || i === currentPage ? (
              <span key={i}>...</span>
            ) : null
          ) : (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`${
                currentPage === i + 1
                  ? "bg-blue-600 text-white p-2 rounded-sm"
                  : "bg-blue-200 text-blue-600 p-2 rounded-sm"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`bg-blue-600 text-white p-2 rounded-sm ${
          currentPage === totalPages
            ? "cursor-not-allowed bg-blue-200"
            : "cursor-pointer"
        }`}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
