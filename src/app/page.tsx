/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import useSWR from "swr"
import axios from "axios"
import { useState } from "react"
import UserForm from "./_components/userForm"

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function UsersPage() {
  const { data: users, mutate } = useSWR("/api/users", fetcher)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function deleteUser(id: number) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return

    await axios.delete(`/api/users/${id}`)
    mutate() // Recarrega lista
  }

  function handleSuccess() {
    mutate()       // Atualiza lista
    setShowForm(false)
    setEditingUser(null)
  }

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuários</h1>

        <button
          onClick={() => {
            setEditingUser(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Novo Usuário
        </button>
      </div>

      {/* FORMULÁRIO */}
      {showForm && (
        <div className="max-w-md">
          <UserForm user={editingUser} onSuccess={handleSuccess} />
        </div>
      )}

      {/* TABELA */}
      <table className="w-full border-collapse shadow-lg rounded overflow-hidden">
        <thead>
          <tr className="text-left">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Nome</th>
            <th className="p-3 border">E-mail</th>
            <th className="p-3 border w-40">Ações</th>
          </tr>
        </thead>

        <tbody>
          {!users && (
            <tr>
              <td className="p-3 text-center" colSpan={4}>
                Carregando...
              </td>
            </tr>
          )}

          {users?.map((user: any) => (
            <tr key={user.id} className="border-t">
              <td className="p-3 border">{user.id}</td>
              <td className="p-3 border">{user.name}</td>
              <td className="p-3 border">{user.email}</td>

              <td className="p-3 border space-x-3">
                <button
                  onClick={() => {
                    setEditingUser(user)
                    setShowForm(true)
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}

          {users?.length === 0 && (
            <tr>
              <td colSpan={4} className="p-3 text-center">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
