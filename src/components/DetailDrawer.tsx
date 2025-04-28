import { JSX } from "preact";

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  columns: {
    key: string;
    label: string;
  }[];
}

export function DetailDrawer({
  isOpen,
  onClose,
  title,
  data,
  columns,
}: DetailDrawerProps): JSX.Element {
  return (
    <div class="drawer drawer-end">
      <input
        id="detail-drawer"
        type="checkbox"
        class="drawer-toggle"
        checked={isOpen}
        onChange={(e) => {
          if (!e.currentTarget.checked) {
            onClose();
          }
        }}
      />
      <div class="drawer-content">{/* 内容区域 */}</div>
      <div class="drawer-side">
        <label
          for="detail-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <h3 class="text-lg font-bold mb-4">{title}</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={`${item.year}-${item.marriages}-${item.divorces}`}>
                    {columns.map((column) => (
                      <td key={column.key}>{item[column.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
