import type { WorkflowContext } from "@upstash/workflow";
import dayjs from 'dayjs';
import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.model";
import type { Document } from "mongoose";

const REMINDERS = [7, 5, 2, 1]

export const sentReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload as any;

    const subscription = await fetchSubscription(context, subscriptionId)

    if (!subscription || subscription.status !== "active") return

    const renewalDate = dayjs(subscription.renewalDate)

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`)
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, "day");

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }

})

const fetchSubscription = async (context: WorkflowContext<unknown>, subscriptionId: string) => {
    return await context.run("get subscription", () => {
        return Subscription.findById(subscriptionId).populate("user", "name email")
    })
}

const sleepUntilReminder = async (context: WorkflowContext<unknown>, label: string, date: dayjs.Dayjs) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context: WorkflowContext<unknown>, label: string, subscription: Document) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        console.log(`Triggering ${label} reminder`)
    })
}