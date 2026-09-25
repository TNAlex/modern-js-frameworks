interface RatingProps {
  value?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
}

function Rating({ value = 0, readOnly = false, onChange }: RatingProps) {
  const currentValue = Number(value) || 0;

  return (
    <span
      className="rating"
      role={readOnly ? "img" : "group"}
      aria-label={`Rating ${currentValue} din 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= currentValue;

        return (
          <button
            key={star}
            type="button"
            className={`rating-star ${filled ? "filled" : "empty"} ${readOnly ? "readonly" : ""}`}
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            aria-label={`Seteaza rating ${star}`}
          >
            ★
          </button>
        );
      })}
    </span>
  );
}

export default Rating;