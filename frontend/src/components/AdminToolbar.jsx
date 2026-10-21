import SquadAdmin from './SquadAdmin';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
const fields=[['runs','Runs'],['balls','Balls faced'],['fours','4s'],['sixes','6s'],['overs_bowled','Overs'],['maidens','Maidens'],['runs_conceded','Runs conceded'],['wickets','Wickets'],['lbw_bowled_count','Bowled/LBW'],['catches','Catches'],['stumpings_direct_runouts','Stumping/direct RO'],['indirect_runouts','Indirect RO']];
const input='max-w-full bg-slate-950 border border-emerald-700 rounded p-2 text-white';
const button='rounded bg-amber-400 px-3 py-2 text-emerald-950 font-bold disabled:opacity-40';
const emptyInnings=()=>({runs:0,wickets:0,overs:'0'});
export default function AdminToolbar({activeMatch,onSimulationComplete,onResetComplete,onLockToggle}){
 const {user,logout}=useAuth();const [open,setOpen]=useState(false),[matches,setMatches]=useState([]),[id,setId]=useState(''),[data,setData]=useState(null),[rows,setRows]=useState([]),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[date,setDate]=useState(''),[venue,setVenue]=useState(''),[result,setResult]=useState('WIN'),[winner,setWinner]=useState(''),[innings,setInnings]=useState({a:emptyInnings(),b:emptyInnings()}),[users,setUsers]=useState([]),[userId,setUserId]=useState(''),[password,setPassword]=useState('');
 if(!user?.is_admin)return null;
 async function load(matchId){
  const r=await api.get(`/admin/matches/${matchId}/stats`);setData(r.data);setId(String(matchId));
  setRows(r.data.players.map(p=>({player_id:p.id,played_xi:false,dismissed:false,...Object.fromEntries(fields.map(([f])=>[f,0])),...(r.data.stats.find(s=>s.player_id===p.id)||{})})));
  const d=new Date(r.data.match.match_date);setDate(new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16));setVenue(r.data.match.venue);
  setResult(r.data.match.result||'WIN');setWinner(r.data.match.winner_team||r.data.match.team_a);setInnings(r.data.match.innings||{a:emptyInnings(),b:emptyInnings()});
 }
 async function action(fn){setBusy(true);setMessage('');try{await fn();}catch(e){setMessage(e.response?.data?.detail||'Request failed. Reload before retrying.');}finally{setBusy(false);}}
 async function show(){setOpen(true);await action(async()=>{const [m,u]=await Promise.all([api.get('/matches'),api.get('/admin/users')]);setMatches(m.data);setUsers(u.data);await load(activeMatch?.id||1);});}
 async function save(finalize){
  if(finalize&&!window.confirm('Finalize this result and recalculate all fantasy teams?'))return;
  await action(async()=>{const r=await api.post(`/admin/matches/${id}/stats`,{stats:rows,finalize,result,winner_team:winner,innings,revision:data.revision});setMessage(r.data.message);await load(id);const m=await api.get('/matches');setMatches(m.data);onSimulationComplete?.();});
 }
 function editRow(index,key,value){setRows(old=>old.map((r,i)=>i===index?{...r,[key]:value}:r));}
 return <section className="border-y border-amber-500/40 bg-emerald-950 px-4 py-3">
  <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center"><strong className="text-amber-300">Tournament administrator</strong><button className={button} onClick={show}>Manage matches & scores</button></div>
  {open&&<div className="fixed inset-0 z-[70] bg-black/90 p-3 sm:p-6 overflow-y-auto"><div className="max-w-7xl mx-auto bg-[#031c15] border border-emerald-700 rounded-xl p-4 space-y-5">
   <header className="flex justify-between items-center"><h2 className="text-xl font-bold">Match administration</h2><button className={button} onClick={()=>setOpen(false)} disabled={busy}>Close</button></header>
   <p className="text-sm text-slate-300">Manual scoring: use a real scorecard. Statistics update all saved teams. Full 50-over ODI results are supported; reduced-overs / DLS results need separate rules. No-result matches award zero fantasy points.</p>
   {message&&<p role="status" className="p-3 bg-slate-900 border border-amber-400 rounded">{message}</p>}
   <fieldset disabled={busy} className="min-w-0 space-y-5 disabled:opacity-60">
   <label className="block">Fixture <select aria-label="Admin fixture" className={input+' ml-2'} value={id} onChange={e=>action(()=>load(e.target.value))}>{matches.map(m=><option value={m.id} key={m.id}>{m.title} — {m.status}</option>)}</select></label>
   {data&&<>
    <div className="flex flex-wrap items-end gap-3">
     <label>Start time (your device timezone)<input aria-label="Match start time" className={input+' block'} type="datetime-local" value={date} onChange={e=>setDate(e.target.value)}/></label>
     <label>Venue<input className={input+' block'} value={venue} onChange={e=>setVenue(e.target.value)}/></label>
     <button className={button} onClick={()=>action(async()=>{const r=await api.post(`/admin/matches/${id}/config`,{match_date:new Date(date).toISOString(),venue});setMessage(r.data.message);await load(id);onLockToggle?.();})}>Save schedule</button>
     <button className={button} disabled={!data.match.is_active||data.match.status==='COMPLETED'} onClick={()=>action(async()=>{const r=await api.post(`/admin/toggle-lock/${id}`);setMessage(r.data.message);await load(id);onLockToggle?.();})}>{data.match.is_locked?'Remove manual lock':'Lock now'}</button>
    </div>
    <p className="text-sm">Status: <strong>{data.match.effective_locked?'Locked':'Open'}</strong>. Scheduled deadlines cannot be bypassed by removing a manual lock. Reschedule an unscored fixture if its date is wrong.</p>
    <div className="overflow-x-auto border border-emerald-800 rounded"><table className="text-xs w-full"><thead><tr><th className="p-2 text-left">Player</th><th>Playing XI</th><th>Dismissed</th>{fields.map(([f,label])=><th key={f} className="p-2 min-w-20">{label}</th>)}</tr></thead><tbody>
     {rows.map((row,i)=>{const p=data.players.find(p=>p.id===row.player_id);return <tr key={row.player_id} className="border-t border-emerald-900"><td className="p-2 min-w-40">{p.name}<br/><span className="text-emerald-300">{p.team} · {p.role}</span></td><td className="text-center"><input aria-label={`${p.name} playing XI`} type="checkbox" checked={row.played_xi} onChange={e=>editRow(i,'played_xi',e.target.checked)}/></td><td className="text-center"><input aria-label={`${p.name} dismissed`} type="checkbox" checked={row.dismissed} onChange={e=>editRow(i,'dismissed',e.target.checked)}/></td>{fields.map(([f,label])=><td key={f} className="p-1"><input aria-label={`${p.name} ${label}`} type={f==='overs_bowled'?'text':'number'} min="0" step="1" className={input+' w-20'} value={row[f]??0} onChange={e=>editRow(i,f,f==='overs_bowled'?e.target.value:Number(e.target.value))}/></td>)}</tr>})}
    </tbody></table></div>
    <p className="text-xs text-slate-300">Overs use cricket notation: 5.5 = five overs and five balls. Select the actual playing XI; leave non-playing players at zero.</p>
    <button className={button} disabled={data.match.status==='COMPLETED'} onClick={()=>save(false)}>Save statistics & update points</button>
    <div className="border-t border-emerald-700 pt-4 space-y-3"><h3 className="font-bold">Finalize / correct match result</h3>
     <select aria-label="Result type" className={input} value={result} onChange={e=>setResult(e.target.value)}><option value="WIN">Win</option><option value="TIE">Tie</option><option value="NO_RESULT">No result</option></select>
     {result==='WIN'&&<select aria-label="Winning team" className={input+' ml-2'} value={winner} onChange={e=>setWinner(e.target.value)}><option>{data.match.team_a}</option><option>{data.match.team_b}</option></select>}
     {result!=='NO_RESULT'&&['a','b'].map(side=><div className="flex flex-wrap gap-2 items-end" key={side}><strong className="w-12">{data.match['team_'+side]}</strong>{['runs','wickets','overs'].map(f=><label key={f}>{f}<input aria-label={`${side} innings ${f}`} className={input+' block w-24'} value={innings[side][f]} type={f==='overs'?'text':'number'} min="0" onChange={e=>setInnings(old=>({...old,[side]:{...old[side],[f]:f==='overs'?e.target.value:Number(e.target.value)}}))}/></label>)}</div>)}
     <button className={button} onClick={()=>save(true)}>Finalize / correct result</button>
    </div>
   </>}
   <SquadAdmin />
   <details className="border-t border-emerald-700 pt-3"><summary className="cursor-pointer font-bold">Account recovery</summary><p className="text-sm my-2">Confirm the player’s identity first. Changing a password signs out all their existing sessions.</p><select aria-label="Account to reset" className={input} value={userId} onChange={e=>setUserId(e.target.value)}><option value="">Choose account</option>{users.map(u=><option key={u.id} value={u.id}>{u.full_name||u.email} — {u.email}</option>)}</select><input aria-label="New account password" className={input+' ml-2'} type="password" placeholder="New password (10+ characters)" value={password} onChange={e=>setPassword(e.target.value)}/><button className={button+' ml-2'} disabled={!userId||password.length<10} onClick={()=>action(async()=>{const r=await api.post(`/admin/users/${userId}/password`,{password});setPassword('');setMessage(r.data.message);if(Number(userId)===user.id)logout();})}>Change password</button></details>
   <details className="border-t border-red-800 pt-3"><summary className="text-red-300 cursor-pointer">Reset tournament</summary><p className="my-2 text-sm">Removes all fantasy teams and scores. Keeps accounts and restores sample fixtures.</p><button className="bg-red-800 rounded p-2" onClick={()=>{if(window.prompt('Type RESET to remove all teams and scores')==='RESET')action(async()=>{const r=await api.post('/admin/reset-tournament',{confirm:'RESET'});setMessage(r.data.message);await load(1);onResetComplete?.();});}}>Reset teams & scores</button></details>
   </fieldset>
  </div></div>}
 </section>;
}
