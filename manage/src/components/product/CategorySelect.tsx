import { TreeSelect } from 'antd';

// models
import { Category } from '../../models';
// utils
import { capitalize } from '../../utils/formatString';

const { TreeNode } = TreeSelect;

const renderSelect = (categories: Category[]) => {
  return categories.map((category) => {
    const { _id, name, children } = category;
    return (
      <TreeNode key={_id} value={_id} title={capitalize(name)}>
        {children && renderSelect(children)}
      </TreeNode>
    );
  });
};
interface CategorySelectProps {
  categories: Category[];
  value?: Category['parent_id'];
  onChange?: (value: CategorySelectProps['value']) => void;
}
const CategorySelect = ({ categories, value, onChange }: CategorySelectProps) => {
  const handleChangeSelected = (newValue: string) => {
    onChange?.(newValue === undefined ? null : newValue);
  };
  return (
    <TreeSelect
      value={value === null ? undefined : value}
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
      placeholder="Parent which categories will be in after creation"
      allowClear
      treeDefaultExpandAll
      onChange={handleChangeSelected}
    >
      {renderSelect(categories)}
    </TreeSelect>
  );
};

export default CategorySelect;
