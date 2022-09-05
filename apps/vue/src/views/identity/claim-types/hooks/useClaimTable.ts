import { useLocalization } from '/@/hooks/abp/useLocalization';
import { useMessage } from '/@/hooks/web/useMessage';
import { useTable } from '/@/components/Table';
import { deleteById, getList } from '/@/api/identity/claim';
import { ValueType } from '/@/api/identity/model/claimModel';
import { formatPagedRequest } from '/@/utils/http/abp/helper';
import { getDataColumns } from '../datas/TableData';
import { getSearchFormSchemas } from '../datas/ModalData';

export function useClaimTable() {
  const { L } = useLocalization('AbpIdentity');
  const { createMessage, createConfirm } = useMessage();
  const valueTypeMap = {
    [ValueType.String]: 'String',
    [ValueType.Int]: 'Int',
    [ValueType.Boolean]: 'Boolean',
    [ValueType.DateTime]: 'DateTime',
  };
  const [registerTable, { reload: reloadTable }] = useTable({
    rowKey: 'id',
    title: L('Roles'),
    columns: getDataColumns(),
    api: getList,
    beforeFetch: formatPagedRequest,
    pagination: true,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    immediate: true,
    rowSelection: { type: 'checkbox' },
    formConfig: getSearchFormSchemas(),
    actionColumn: {
      width: 180,
      title: L('Actions'),
      dataIndex: 'action',
    },
  });

  function handleDelete(role) {
    createConfirm({
      iconType: 'warning',
      title: L('AreYouSure'),
      content: L('ItemWillBeDeletedMessageWithFormat', [role.name]),
      okCancel: true,
      onOk: () => {
        return deleteById(role.id).then(() => {
          createMessage.success(L('SuccessfullyDeleted'));
          reloadTable();
        });
      },
    });
  }

  return {
    valueTypeMap,
    registerTable,
    reloadTable,
    handleDelete,
  };
}
