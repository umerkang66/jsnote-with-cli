import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

// Only bind the actions only one time
export const useActions = () => {
  const dispatch = useDispatch();
  // bindActionCreators will bind all the actionCreators, and when we will call the these action creators, the return values will be automatically passed from the dispatch function

  // Now the value of actions creators only will change, when this array changes, which in our case, that changes only first time, when useAction is called
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
