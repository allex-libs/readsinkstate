function createLib (execlib) {
  'use strict';

	var taskRegistry = execlib.execSuite.taskRegistry,
		q = execlib.lib.q;

  function stateFieldWaiterEnder (defer, taskobj, result) {
    if (taskobj) {
      if(taskobj.mtask) {
        taskobj.mtask.destroy();
      }
      taskobj.mtask = null;
      if(taskobj.rtask) {
        taskobj.rtask.destroy();
      }
      taskobj.rtask = null;
    }
    taskobj = null;
    if (defer) {
      defer.resolve(result);
    }
    defer = null;
  }
  function waitForStateField (sink, statefield) {
    var d = q.defer(), ret = d.promise, taskobj = {mtask: null, rtask: null},
      _d = d, _to = taskobj;
    taskobj.mtask = taskRegistry.run('materializeState', {
      sink: sink
    });
    taskobj.rtask = taskRegistry.run('readState', {
      state: taskobj.mtask,
      name: statefield,
      cb: stateFieldWaiterEnder.bind(null, _d, _to)
    });
    _d = null;
    _to = null;
    return ret;
  }

	return waitForStateField;
}

module.exports = createLib;
