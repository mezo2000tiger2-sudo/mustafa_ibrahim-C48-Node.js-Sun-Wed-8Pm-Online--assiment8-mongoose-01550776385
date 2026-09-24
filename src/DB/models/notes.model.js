import mongoose, { Types } from "mongoose";

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return value !== value.toUpperCase();
            },
            message: (props) => `"${props.value}" must not be entirely uppercase.`,
        },
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type:Types.ObjectId,
        ref:'Users',
        required: true,
    },
},{
    timestamps: true,
});

const notesModel =mongoose.model.Notes || mongoose.model("Notes", notesSchema);
export default notesModel;