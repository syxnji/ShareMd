import { BsPlus, BsX } from "react-icons/bs";
import styles from "./permissionManagement.module.css";
import { MdOutlineShield, MdShield } from "react-icons/md";
import { toast } from "react-toastify";
import { useState } from "react";

export const PermissionManagement = ({
  customToastOptions,
  refresh,
  selectedGroup,
  permission,
  roleToPermit,
}) => {

  // MARK: newRoleName
  const [newRoleName, setNewRoleName] = useState("");
  const handleChangeNewRoleName = async (e) => {
    setNewRoleName(e.target.value);
  };

  // MARK: newPermitId
  const [newPermitId, setNewPermitId] = useState(1);
  const handleChangeNewPermit = async (e) => {
    setNewPermitId(e.target.value);
  };

  // MARK: addRole ← newRoleName, newPermitId
  const handleAddRole = async (e) => {
    if (newRoleName.length > 0) {
      e.preventDefault();
      await fetch(`/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "addRole",
          roleName: newRoleName,
          groupId: selectedGroup.id,
          permissionId: newPermitId,
        }),
      });
      setNewRoleName("");
      setNewPermitId(1);
      refresh();
      toast.success("役職を追加しました", customToastOptions);
    }
  };
  
  // MARK: changeRoleName ← roleId
  const handleChangeRoleName = async (e, roleId) => {
    await fetch(`/api/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "updateRoleName",
        roleId: roleId,
        roleName: e.target.value,
      }),
    });
    refresh();
    toast.success("役職名を更新しました", customToastOptions);
  };

  // MARK: changePermit ← newPermitId
  const handleChangePermit = async (e, roleId) => {
    const newPermitId = parseInt(e.target.value, 10);
    await fetch(
      `/api/patch`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "updateRoleToPermit",
          roleId: roleId,
          permitId: newPermitId,
        }),
      },
    );
    refresh();
    toast.success("権限を更新しました", customToastOptions);
  };

  // MARK: deleteRole
  const handleDeleteRole = async (e, roleId) => {
    e.preventDefault();
    await fetch(`/api/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "deleteRole",
        roleId: roleId,
      }),
    });
    refresh();
    toast.success("役職を削除しました", customToastOptions);
  };


  return (
    <div className={styles.permitContent}>
      <div className={styles.addRole}>
        <input
          type="text"
          placeholder="役職名"
          className={styles.roleName}
          onChange={(e) => handleChangeNewRoleName(e)}
          value={newRoleName}
        />

        <select
          className={styles.roleSelect}
          onChange={(e) => handleChangeNewPermit(e)}
        >
          {permission.map((permit) => (
            <option key={permit.id} value={permit.id}>
              {permit.name}
            </option>
          ))}
        </select>
        <button className={styles.addBtn} onClick={(e) => handleAddRole(e)}>
          <BsPlus />
        </button>
      </div>
      <div className={styles.roleList}>
        {roleToPermit.length > 0 ? (
          roleToPermit.map((role) => (
            <div className={styles.role} key={role.id}>
              <div className={styles.roleIcon}>
                {role.id === 1 || role.id === 2 ? (
                  <MdShield />
                ) : (
                  <MdOutlineShield />
                )}
              </div>
              <input
                type="text"
                placeholder="役職名"
                className={styles.roleName}
                defaultValue={role.name}
                onBlur={(e) => handleChangeRoleName(e, role.id)}
                disabled={role.id === 1 || role.id === 2}
              />

              <select
                className={styles.roleSelect}
                onChange={(e) => handleChangePermit(e, role.id)}
                value={role.permission_id}
                disabled={role.id === 1 || role.id === 2}
              >
                {permission.map((permit) => (
                  <option key={permit.id} value={permit.id}>
                    {permit.name}
                  </option>
                ))}
              </select>
              <button
                className={styles.deleteBtn}
                onClick={(e) => handleDeleteRole(e, role.id)}
                disabled={role.id === 1 || role.id === 2}
              >
                <BsX />
              </button>
            </div>
          ))
        ) : (
          <p>役職がありません</p>
        )}
      </div>
    </div>
  );
};
