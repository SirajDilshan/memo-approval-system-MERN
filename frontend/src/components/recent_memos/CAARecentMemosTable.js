import { useState } from 'react';
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
  Typography,
} from '@mui/material';

const CAARecentMemosTable = ({ memos }) => {
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const filteredMemos = showOnlyPending
    ? memos.filter((memo) => memo.status.toLowerCase() === 'pending')
    : memos;

  return (
    <Box mt={6}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Recent Memos</Typography>
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
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Memo Id</TableCell>
                <TableCell>Memo Title</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMemos.map((memo, idx) => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CAARecentMemosTable;
