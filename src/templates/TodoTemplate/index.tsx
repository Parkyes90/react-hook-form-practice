import React, { ReactNode, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  Checkbox,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import { v4 } from 'uuid';

const useStyles = makeStyles({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 500,
    flexDirection: 'column',
  },
});

type ListItemType = {
  id: string;
  content: string;
  checked: boolean;
};

type FormType = {
  content: string;
};

const TodoTemplate: React.FC = () => {
  const classes = useStyles();
  const [list, setList] = useState<ListItemType[]>([]);
  const { control, handleSubmit, reset } = useForm<FormType>();
  const onSubmit = React.useCallback(
    (values) => {
      const newListItem = { ...values, id: v4(), checked: false };
      setList([...list, newListItem]);
      reset();
    },
    [list, reset],
  );
  const onToggleChecked = (id: string) => (): void => {
    const newList = list.map((listItem) => {
      if (listItem.id === id) {
        return {
          ...listItem,
          checked: !listItem.checked,
        };
      }
      return listItem;
    });
    setList(newList);
  };
  const removeListItem = (id: string) => (): void => {
    const newList = list.filter((listItem) => listItem.id !== id);
    setList(newList);
  };
  const renderListItem = (): ReactNode => {
    return list.map((listItem) => {
      return (
        <ListItem key={listItem.id}>
          <Checkbox
            checked={listItem.checked}
            onChange={onToggleChecked(listItem.id)}
          />
          <span
            style={{
              textDecoration: listItem.checked ? 'line-through' : 'inherit',
            }}
          >
            {listItem.content}
          </span>
          <Button variant="outlined" onClick={removeListItem(listItem.id)}>
            삭제
          </Button>
        </ListItem>
      );
    });
  };

  return (
    <Container>
      <Paper className={classes.paper}>
        <Typography variant="h3">할일 목록</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="content"
            control={control}
            defaultValue=""
            as={<TextField label="할일 입력" />}
          />
        </form>
        <List>{renderListItem()}</List>
      </Paper>
    </Container>
  );
};

export default TodoTemplate;
