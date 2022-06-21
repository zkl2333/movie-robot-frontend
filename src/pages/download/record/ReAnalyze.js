import React, {useEffect} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import axios from "../../../utils/request";

const ReAnalyze = ({data, setAnalyze, setMessage}) => {
    const [values, setValues] = React.useState({tmdbId: null, id: null, name: "", year: "", seasonIndex: null});
    const [errors, setErrors] = React.useState({});
    const [showErrors, setShowErrors] = React.useState({});
    const handleValueChange = (e) => {
        if (e.target.type === "checkbox") {
            setValues({...values, [e.target.name]: e.target.checked});
        } else {
            setValues({...values, [e.target.name]: e.target.value});
        }
    };
    const onReAnalyze = (values) => {
        let hasError = false;
        if (!values.tmdbId) {
            if (values.name === undefined || values.name === "") {
                setErrors({...errors, name: "必须填写影视名称"});
                setShowErrors({...errors, name: true});
                hasError = true;
            }
            if (values.year === undefined || values.year === "") {
                setErrors({...errors, year: "必须填写发行年份"});
                setShowErrors({...errors, year: true});
                hasError = true;
            }
        }
        if (hasError) {
            return;
        } else {
            setErrors({});
            setShowErrors({});
        }
        axios.get("/api/download/reanalyse", {
            params: {
                id: data.id,
                tmdb_id: values.tmdbId,
                name: values.name,
                year: values.year,
                season_index: values.seasonIndex
            }
        }).then((res) => {
            setMessage(res.message);
            setAnalyze({name: "", open: false, year: "", id: undefined});
        });
    };
    const handleClose = () => {
        setAnalyze({open: false});
        setErrors({});
        setShowErrors({});
    };
    useEffect(() => {
        setValues({...values, name: data.name, id: data.id, year: data.year});
    }, [data]);
    return (<Dialog
        open={data.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
    >
        <DialogTitle id="form-dialog-title">重新识别</DialogTitle>
        <DialogContent>
            <DialogContentText>
                提供正确的影视名称和年份，提交后，机器人将重新识别整理、通知。
            </DialogContentText>
            <TextField
                type="text"
                name="tmdbId"
                margin="dense"
                label="TMDBID或访问地址"
                error={Boolean(showErrors.tmdbId && errors.tmdbId)}
                helperText={showErrors.tmdbId && errors.tmdbId}
                fullWidth
                defaultValue={values.tmdbId}
                onChange={handleValueChange}
            />
            <TextField
                autoFocus
                type="text"
                name="name"
                margin="dense"
                label="影视名称"
                error={Boolean(showErrors.name && errors.name)}
                helperText={showErrors.name && errors.name}
                fullWidth
                defaultValue={values.name}
                onChange={handleValueChange}
            />
            <TextField
                type="text"
                name="year"
                margin="dense"
                label="发行年份"
                fullWidth
                defaultValue={values.year}
                onChange={handleValueChange}
                error={Boolean(showErrors.year && errors.year)}
                helperText={showErrors.year && errors.year}
            />
            <TextField
                type="number"
                name="seasonIndex"
                margin="dense"
                label="季度数"
                error={Boolean(showErrors.seasonIndex && errors.seasonIndex)}
                helperText={showErrors.seasonIndex && errors.seasonIndex}
                fullWidth
                defaultValue={values.seasonIndex}
                onChange={handleValueChange}
            />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={() => onReAnalyze(values)}>
                提交
            </Button>
            <Button onClick={handleClose} color="primary">
                取消
            </Button>
        </DialogActions>
    </Dialog>);
};

export default ReAnalyze;
