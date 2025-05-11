import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

const RecentMemosTable = ({ memos }) => {
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const caaMemos = useMemo(
    () => memos.filter((memo) => memo.createdBy?.role === 'CAA_Department'),
    [memos]
  );

  const filteredMemos = useMemo(() => {
    return showOnlyPending
      ? caaMemos.filter((memo) => memo.status.toLowerCase() === 'pending')
      : caaMemos;
  }, [caaMemos, showOnlyPending]);

  return (
    <Box mt={4}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Recent Memos
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setShowOnlyPending(!showOnlyPending)}
          >
            {showOnlyPending ? 'Show All' : 'Show Only Pending'}
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Memo Id</TableCell>
                <TableCell>Memo Title</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMemos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No memos found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMemos.map((memo, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{memo.memo_id}</TableCell>
                    <TableCell>{memo.title}</TableCell>
                    <TableCell>
                      {memo.createdBy?.email} ({memo.createdBy?.role})
                    </TableCell>
                    <TableCell>{memo.status}</TableCell>
                    <TableCell>
                      {new Date(memo.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RecentMemosTable;
