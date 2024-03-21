package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

@Service
public class SchedulerInvoker {
    /*private final TaskScheduler taskScheduler;

    @Autowired
    public SchedulerInvoker(TaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
        executeTask();
    }
    @Async
    public void executeTask() {
        taskScheduler.schedule(new EventRunner(), new CronTrigger("5 * * * * * "));
    }*/
}
