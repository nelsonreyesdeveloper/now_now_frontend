const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="grid grid-cols-3 lg:gap-4 lg:w-5/12 mt-5">
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
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`bg-blue-600 text-white p-2 rounded-sm ${
              currentPage === i + 1 ? " bg-blue-900 border-white" : ""
            }`}
            onClick={() => {
              console.log(i + 1)
              handlePageChange(i + 1);
            }}
          >
            {i + 1}
          </button>
        ))}
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
