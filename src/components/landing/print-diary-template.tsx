/**
 * A4 paper version of the diary: 14 day rows x 3 metric columns + note.
 * Hidden on screen; it is the only thing visible when the page is printed.
 */
const COLUMNS = ["Ngày", "Ngày tháng", "Độ dầu (1-5)", "Mụn (1-5)", "Cảm giác (1-5)", "Ghi chú"];

export function PrintDiaryTemplate() {
  return (
    <div className="hidden text-[#1f2e32] print:block">
      <h1 className="text-2xl font-extrabold">14 ngày hiểu da: mẫu nhật ký</h1>
      <p className="mt-1 text-sm">
        Cùng chỗ, cùng giờ, cùng ánh sáng. Ghi 3 chỉ số từ 1 đến 5 và một dòng ghi chú. #14NgayHieuDa
      </p>
      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} className="border border-[#3f5a60] px-2 py-2 text-left font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 14 }, (_, index) => (
            <tr key={index} className="h-[13mm]">
              <td className="border border-[#3f5a60] px-2 font-semibold">{index + 1}</td>
              {COLUMNS.slice(1).map((column) => (
                <td key={column} className="border border-[#3f5a60] px-2" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs">skinsense-ai-coral.vercel.app/14-ngay-hieu-da</p>
    </div>
  );
}
