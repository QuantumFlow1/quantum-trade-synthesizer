
export const EmptyTransactions = () => {
  return (
    <div className="flex justify-center items-center h-64 border rounded-md">
      <div className="text-center">
        <p className="text-muted-foreground">No transactions found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
      </div>
    </div>
  );
};
