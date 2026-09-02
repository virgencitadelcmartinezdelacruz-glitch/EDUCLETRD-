<td className="p-1 text-center border border-slate-200 bg-amber-50/30">
                              <input type="number" min="0" max="100" value={gData.rp4 ?? ''} placeholder="--"
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp4', e.target.value)}
                                className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-2 text-center border border-slate-200 bg-slate-100 font-black text-slate-900">
                              {groupFinal}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      <td className={`p-2.5 text-center font-black text-xs ${isApproved ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                        {overallFinal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              Estudiantes en Sección : <strong className="text-slate-900">{students.length}</strong>
            </div>
            <div>
              Aprobados (&ge; 70 ): <strong className="text-emerald-700">{approvedCount}</strong>
            </div>
            <div>
              En Proceso ({'<'}&nbsp;70): <strong className="text-amber-700">{processCount}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}