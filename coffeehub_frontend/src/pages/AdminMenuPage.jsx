import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminMenuPage(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', description:'', priceCents:100, category:null });
  useEffect(()=> load(), []);
  const load = ()=> api.get('/api/menu').then(r=> setItems(r.data));
  const save = async ()=> {
    if(form.id) await api.put(`/api/menu/${form.id}`, form); else await api.post('/api/menu', form);
    setForm({ name:'', description:'', priceCents:100, category:null });
    load();
  };
  const edit = (it)=> setForm(it);
  const remove = async (id)=> { await api.delete(`/api/menu/${id}`); load(); };
  return (
    <div className="container mx-auto px-6 py-10 text-black">
      <h2 className="text-2xl mb-4">Admin Menu Management</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-[#f3e9df] rounded">
          <input placeholder="Name" value={form.name} onChange={e=> setForm({...form, name: e.target.value})} />
          <textarea placeholder="Description" value={form.description} onChange={e=> setForm({...form, description: e.target.value})} />
          <input type="number" value={form.priceCents} onChange={e=> setForm({...form, priceCents: Number(e.target.value)})} />
          <button className="mt-2 bg-[#c8a482] px-4 py-2 rounded" onClick={save}>Save</button>
        </div>
        <div>
          {items.map(it => (
            <div key={it.id} className="p-3 bg-[#2a1b15] text-white rounded mb-3 flex justify-between">
              <div>
                <div className="font-bold">{it.name}</div>
                <div className="text-sm text-[#e6ccb2]">₹ {(it.priceCents/100).toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=> edit(it)} className="px-2 py-1 bg-white text-black rounded">Edit</button>
                <button onClick={()=> remove(it.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
