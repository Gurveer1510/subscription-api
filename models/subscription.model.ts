import mongoose, { mongo } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLenght: 100
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "price must be greater than 0"]
    },
    currency: {
        type: String,
        enum: ["USD", "INR", "CAD"],
        default: "INR"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"]
    },
    category: {
        type: "String",
        required: [true, "category is required"],
        enum: ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"]
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value: Date) => value <= new Date(),
            message: "Start date must be in the past"
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value: Date) {
                return value <= new Date()
            },
            message: "Renewal date must be after the Start date"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });

subscriptionSchema.pre("save", function (next) {
    console.log(this.renewalDate)
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }

        this.renewalDate = new Date(this.startDate)
        if (this.frequency) {
            this.renewalDate.setDate(this.renewalDate.getDate() + (renewalPeriods[this.frequency]))
        } else {
            this.renewalDate.setDate(this.renewalDate.getDate() + 30)
        }
    }
    console.log(this.renewalDate)


    if(this.renewalDate < new Date()){
        this.status = "expired"
    }

    next()
})

const Subscription = mongoose.model("Subscription", subscriptionSchema)

export default Subscription